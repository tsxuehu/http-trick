import http from "http";
import koa from "koa";
import path from "path";
import koaBody from "koa-body";
import staticServe from "koa-static";
import router from "./router";
import SocketIO from "socket.io";
import cookie from "cookie";
import Responsitory from "../repository";

export default class UiServer {

    constructor(webUiPort) {
        this.webUiPort = webUiPort;

        //
        this.runTimeInfoRepository = Responsitory.getRuntimeInfoRepository();
        this.runTimeInfoRepository = Responsitory.get;

        // 初始化koa
        this.app = koa();
        this.app.use(koaBody({multipart: true}));
        this.app.use(staticServe(path.join(__dirname, '../../../webui')));
        this.app.use(router());

        // 创建server
        this.server = http.createServer(app.callback());
        this.io = new SocketIO(this.server);

        // 初始化socket io
        this._initStore();
        this._initTraffic();
        this._initWsMock();

    }

    async start() {
        // 启动server
        this.server.listen(this.webUiPort);
    }

    _initTraffic() {
        this.httpTraficMonitorNS = this.io.of('/httptrafic');
        this.httpTraficMonitorNS.on('connection', function (client) {
            let userId = this._getUserId(client);

            client.join(userId, err => {
            });
            this.runTimeInfoRepository.incHttpTrafficMonitor(userId);
            client.on('disconnect', function () {
                this.runTimeInfoRepository.decHttpTrafficMonitor(userId);
            });
        });
        // 监听logRespository事件,

    }

    _initStore() {
        this.storeMonitorNS = this.io.of('/store');

        // 注册通知
        this.storeMonitorNS.on('connection', function (client) {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            client.on('internal state', function () {
                // 基础配置
                api.sentToClientConfState(dc.getConf());
                // host文件列表
                api.sentToClientHostFileList(dc.getHostFileList());
                // 规则文件列表
                api.sentToClientRuleFileList(dc.getRuleFileList());
                // 数据文件列表
                api.sentToClientDataListChange(dc.getDataList());
            })
        });
    }
    sendConfToUser(userId){

    }
    sendHostFileListToUser(userId){

    }
    sendRuleFileListToUser(userId){

    }
    sendDataFileListToUser(userId){

    }

    _initWsMock() {
        this.wsmockNS = this.io.of('/wsmock');

        wsmockNS.on('connection', function (debugClient) {
            dc.inWsMockClient();
            // 开启调试会话,返回会话id
            debugClient.on('opensession', function (urlPattern) {
                var sessionId = wsMock.openSession(debugClient.id, urlPattern);
                wsmockNS.emit('assignedsessionid', urlPattern, sessionId);
            });
            debugClient.on('closesession', function (sessionId) {
                wsMock.closeSession(sessionId);
            });
            // mock 界面发回的数据 ， 需要返回给正在mock的页面
            debugClient.on('debuggermsg', function (sessionId, data) {
                wsMock.sendToPageMsg(sessionId, data)
            });
            // 关闭该客户端的所有会话
            debugClient.on('disconnect', function () {
                dc.outWsMockClient();
                wsMock.closeAllSessionInSocket(debugClient.id);
            });
        });
        /* // 页面和proxy建立连接, id为页面对应的调试会话
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
         });*/

    }

    _getUserId(socketIOConn) {
        let cookies = cookie.parse(socketIOConn.request.headers.cookie);
        return cookies['userId']
    }
}

new UiServer(8020).start();