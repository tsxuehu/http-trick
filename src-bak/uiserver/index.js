var dc = require('../datacenter');
var http = require('http');
var koa = require('koa');
var app = koa();
var path = require('path');
var koaBody = require('koa-body');
require('koa-qs')(app);
var staticServe = require('koa-static');
var sync = require('../sync');
// ==========================================================
// 初始化中间件
app.use(koaBody({multipart: true}));
app.use(staticServe(path.join(__dirname, '../../webui')));
app.use(require('./router'));


var server = http.createServer(app.callback());
// ==========================================================
// socket io
var io = require('socket.io')(server);

// ================== http trafic monitor ==================
var httpTraficMonitorNS = io.of('/httptrafic');
httpTraficMonitorNS.on('connection', function (client) {
    dc.inHttpTraficMonitor();
    client.on('disconnect', function () {
        dc.outHttpTraficMonitor();
    });
});
// 数据中心监控 ws
// ================== store monitor ==================
var storeMonitorNS = io.of('/store');
storeMonitorNS.on('connection', function (client) {
    dc.inStoreMonitor();
    sync.check();
    client.on('disconnect', function () {
        dc.outStoreMonitor();
    });

    // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
    client.on('internal state', function () {
        api.sentToClientRuntimeState(dc.getRuntimeInfo());
        api.sentToClientConfState(dc.getConf());
        api.sentToClientHostState(dc.getHostMap());
        api.sentToClientGlobHostState(dc.getGlobHostMap());
        api.sentToClientRuleState(dc.getInuseRules());
        api.sentToClientHostFileList(dc.getHostFileList());
        api.sentToClientRuleFileList(dc.getRuleFileList());
        api.sentToClientDataListChange(dc.getDataList());
    })
});
// ================== websocket mock ==================
var wsMock = require('../proxy/ws-mock');
// web socket mock 使用的链接
var wsmockNS = io.of('/wsmock');
wsmockNS.on('connection', function (debugClient) {
    dc.inWsMockClient();
    // 开启调试会话,返回会话id
    debugClient.on('opensession', function (urlPattern) {
        var sessionId = wsMock.openSession(debugClient.id, urlPattern);
        wsmockNS.emit('assignedsessionid', urlPattern , sessionId);
    });
    debugClient.on('closesession', function (sessionId) {
        wsMock.closeSession(sessionId);
    });
    // mock 界面发回的数据 ， 需要返回给正在mock的页面
    debugClient.on('debuggermsg', function (sessionId ,data) {
        wsMock.sendToPageMsg(sessionId , data)
    });
    // 关闭该客户端的所有会话
    debugClient.on('disconnect', function () {
        dc.outWsMockClient();
        wsMock.closeAllSessionInSocket(debugClient.id);
    });
});
// 页面和proxy建立连接, id为页面对应的调试会话
wsMock.on('page-connected',function (sessionId) {
    wsmockNS.emit('page-connected',sessionId);
});
// 页面发出消息 id为页面对应的调试会话, data为消息内容
wsMock.on('page-msg',function (sessionId ,data) {
    wsmockNS.emit('page-msg', sessionId, data);
});
// 页面关闭 id为页面对应的调试会话
wsMock.on('page-closed',function (sessionId) {
    wsmockNS.emit('page-closed',sessionId);
});
// =================================================  向客户端发送信息函数
function sentHttptraficToClient(type, data) {
    httpTraficMonitorNS.emit(type, data);
};
function sentStateToClient(type, data) {
    storeMonitorNS.emit(type, data);
};
// ==========================================================
var api = {
    startUiServer: function (uiPort) {
        server.listen(uiPort);
    },
    // 发送请求
    sentToClientRequest: function (data) {
        sentHttptraficToClient('proxy', data);
    },
    // 发送请求处理日志
    sentToClientLog: function (msg) {
        sentLogToClient(msg);
    },
    // 发送运行状态
    sentToClientRuntimeState: function (runtimeInfo) {
        sentStateToClient('runtime', runtimeInfo);
    },
    // 发送配置信息
    sentToClientConfState: function (conf) {
        sentStateToClient('conf', conf);
    },
    // 发送生效的host
    sentToClientHostState: function (host) {
        sentStateToClient('host', host);
    },
    sentToClientGlobHostState: function (globHost) {
        sentStateToClient('globhost', globHost);
    },
    // 发送生效的规则
    sentToClientRuleState: function (ruleList) {
        sentStateToClient('rule', ruleList);
    },
    // 发送host文件简要信息
    sentToClientHostFileList: function (hostFileList) {
        sentStateToClient('hostfilelist', hostFileList);
    },
    // 发送规则文件简要信息
    sentToClientRuleFileList: function (ruleFileList) {
        sentStateToClient('rulefilelist', ruleFileList);
    },
    // 发送数据文件列表
    sentToClientDataListChange: function (dataList) {
        sentStateToClient('datalist', dataList);
    }
};
dc.on('runtimeChange', api.sentToClientRuntimeState);
dc.on('confChange', api.sentToClientConfState);
dc.on('hostChange', api.sentToClientHostState);
dc.on('globHostChange', api.sentToClientGlobHostState);
dc.on('ruleChange', api.sentToClientRuleState);
dc.on('hostFileListChange', api.sentToClientHostFileList);
dc.on('ruleFileListChange', api.sentToClientRuleFileList);
dc.on('dataListChange', api.sentToClientDataListChange);

module.exports = api;

