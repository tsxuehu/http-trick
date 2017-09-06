import http from "http";
import koa from "koa";
import path from "path";
import koaBody from "koa-body";
import koaQs from "koa-qs";
import staticServe from "koa-static";
import router from "./router";
import SocketIO from "socket.io";
import cookieParser from "cookie";
import Repository from "../repository";

export default class UiServer {

    constructor(webUiPort) {
        this.webUiPort = webUiPort;

        // 数据存储服务
        this.runTimeInfoRepository = Repository.getRuntimeInfoRepository();
        this.httpTrafficRepository = Repository.getHttpTrafficRepository();
        this.confRepository = Repository.getConfigureRepository();
        this.hostRepository = Repository.getHostRepository();
        this.mockDataRepository = Repository.getMockDataRepository();
        this.ruleRepository = Repository.getRuleRepository();
        this.wsMockRepository = Repository.getWsMockRepository();
        this.userRepository = Repository.getUserRepository();

        // 初始化koa
        this.app = koa();
        koaQs(this.app);
        this.app.use(koaBody({multipart: true}));
        this.app.use(staticServe(path.join(__dirname, '../../../webui')));
        this.app.use(async (ctx, next) => {
            let cookies = cookieParser.parse(ctx.request.headers.cookie);
            ctx.userId = cookies['userId'] || '0';
            await next();
        });
        this.app.use(router());

        // 创建server
        this.server = http.createServer(this.app.callback());
        this.io = new SocketIO(this.server);

        // 初始化socket io
        this._initTraffic();
        this._initManger();
        this._initWsMock();
    }

    async start() {
        // 启动server
        this.server.listen(this.webUiPort);
    }

    // http流量监控界面
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

        // 监听logRespository事件
        this.httpTrafficRepository.on('traffic', (clientIp, rows) => {
            let userId = this.userRepository.getClientIpMappedUserId(clientIp);
            this.sendTrafficToUser(userId, rows)
        });
    }

    sendTrafficToUser(userId, rows) {
        this.httpTraficMonitorNS.to(userId).emit('rows', rows);
    }

    // 管理界面 使用的功能
    _initManger() {
        this.storeMonitorNS = this.io.of('/store');

        // 注册通知
        this.storeMonitorNS.on('connection', function (client) {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            client.on('internal state', _ => {
                // 基础配置
                this.sendConfToUser(userId, this.confRepository.getConf(userId));
                // host文件列表
                this.sendHostFileListToUser(userId, this.hostRepository.getHostFileList(userId));
                // 规则文件列表
                this.sendRuleFileListToUser(userId, this.ruleRepository.getRuleFileList(userId));
                // 数据文件列表
                this.sendDataFileListToUser(userId, this.mockDataRepository.getDataFileList(userId));
            })
        });
        this.confRepository.on("dataChange", (userId, conf) => {
            this.sendConfToUser(userId, conf);
        });
        this.hostRepository.on("dataChange", (userId, hostFilelist) => {
            this.sendHostFileListToUser(userId, hostFilelist);
        });
        this.ruleRepository.on("dataChange", (userId, ruleFilelist) => {
            this.sendRuleFileListToUser(userId, ruleFilelist);
        });
        this.mockDataRepository.on("dataChange", (userId, dataFilelist) => {
            this.sendDataFileListToUser(userId, dataFilelist);
        });
    }

    sendConfToUser(userId, conf) {
        this.storeMonitorNS.to(userId).emit('conf', conf);
    }

    sendHostFileListToUser(userId, hostFilelist) {
        this.storeMonitorNS.to(userId).emit('hostfilelist', hostFilelist);
    }

    sendRuleFileListToUser(userId, ruleFilelist) {
        this.storeMonitorNS.to(userId).emit('rulefilelist', ruleFilelist);
    }

    sendDataFileListToUser(userId, dataFilelist) {
        this.storeMonitorNS.to(userId).emit('datalist', dataFilelist);
    }

    // ws mock 相关函数
    _initWsMock() {
        this.wsmockNS = this.io.of('/wsmock');

        this.wsmockNS.on('connection', debugClient => {

            let userId = this._getUserId(debugClient);
            debugClient.join(userId, err => {
            });
            // 将websocket的id返回给浏览器
            let connection = this.wsMockRepository.newConnectionId(userId);

            debugClient.emit('connection-id', connection);
            /* // 用户开启调试会话,返回会话id
             debugClient.on('opensession', urlPattern => {
             let sessionId = this.wsMockRepository.openSession(userId, debugClient.id, urlPattern);
             this.sendAssignedSessionIdToUser(userId, urlPattern, sessionId);
             });
             // 用户关闭会话
             debugClient.on('closesession', function (sessionId) {
             this.wsMockRepository.closeSession(sessionId);
             });
             // mock 界面发回的数据 ， 需要返回给正在mock的页面
             debugClient.on('debuggermsg', function (sessionId, data) {
             this.wsMockRepository.sendToPageMsg(sessionId, data);
             });*/
            // 用户关闭ws界面  关闭该链接相关的所有会话
            debugClient.on('disconnect', function () {
                this.wsMockRepository.closeAllSessionInSocket(debugClient.id);
            });
        });
        this.wsMockRepository.on("page-connected", (userId, sessionId) => {
            this.sendPageConnectedToUser(userId, sessionId);
        });
        this.wsMockRepository.on("page-msg", (userId, sessionId, data) => {
            this.sendPageMsgToUser(userId, sessionId, data);
        });
        this.wsMockRepository.on("page-closed", (userId, sessionId) => {
            this.sendPageClosedToUser(userId, sessionId);
        });
    }

    sendAssignedSessionIdToUser(userId, urlPattern, sessionId) {
        this.wsMockRepository.to(userId).emit('assignedsessionid', urlPattern, sessionId);
    }

    sendPageConnectedToUser(userId, sessionId) {
        this.wsMockRepository.to(userId).emit('page-connected', sessionId);
    }

    sendPageMsgToUser(userId, sessionId, data) {
        this.wsMockRepository.to(userId).emit('page-msg', sessionId, data);
    }

    sendPageClosedToUser(userId, sessionId) {
        this.wsMockRepository.to(userId).emit('page-closed', sessionId);
    }

    // 通用函数，获取socket连接中的用户id
    _getUserId(socketIOConn) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie);
        return cookies['userId'] || '0';
    }
}
