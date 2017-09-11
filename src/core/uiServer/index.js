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
        this.httpTrafficRepository = Repository.getHttpTrafficRepository();
        this.confRepository = Repository.getConfigureRepository();
        this.hostRepository = Repository.getHostRepository();
        this.mockDataRepository = Repository.getMockDataRepository();
        this.ruleRepository = Repository.getRuleRepository();
        this.wsMockRepository = Repository.getWsMockRepository();
        this.breakpointRepository = Repository.getBreakpointRepository();

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
        this._initBreakpoint();
    }

    async start() {
        // 启动server
        this.server.listen(this.webUiPort);
    }

    // http流量监控界面
    _initTraffic() {
        this.httpTraficMonitorNS = this.io.of('/httptrafic');
        this.httpTraficMonitorNS.on('connection', client => {
            let userId = this._getUserId(client);

            client.join(userId, err => {
            });
            this.httpTrafficRepository.incMonitor(userId);
            client.on('disconnect', function () {
                this.httpTrafficRepository.decMonitor(userId);
            });
        });

        // 监听logRespository事件
        this.httpTrafficRepository.on('traffic', (userId, rows) => {
            this.httpTraficMonitorNS.to(userId).emit('rows', rows);
        });
    }

    // 管理界面 使用的功能
    _initManger() {
        this.managerNS = this.io.of('/manager');

        // 注册通知
        this.managerNS.on('connection', client => {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            // 推送最新数据
            client.emit('conf',this.confRepository.getConf(userId));
            client.emit('hostfilelist',this.hostRepository.getHostFileList(userId));
            client.emit('rulefilelist',this.ruleRepository.getRuleFileList(userId));
            client.emit('datalist',this.mockDataRepository.getMockDataList(userId));
        });
        this.confRepository.on("data-change", (userId, conf) => {
            this.managerNS.to(userId).emit('conf', conf);
        });
        this.hostRepository.on("data-change", (userId, hostFilelist) => {
            this.managerNS.to(userId).emit('hostfilelist', hostFilelist);
        });
        this.ruleRepository.on("data-change", (userId, ruleFilelist) => {
            this.managerNS.to(userId).emit('rulefilelist', ruleFilelist);
        });
        this.mockDataRepository.on("data-change", (userId, dataFilelist) => {
            this.managerNS.to(userId).emit('datalist', dataFilelist);
        });
    }

    // ws mock 相关函数
    _initWsMock() {
        this.wsmockNS = this.io.of('/wsmock');

        this.wsmockNS.on('connection', debugClient => {

            let userId = this._getUserId(debugClient);
            debugClient.join(userId, err => {
            });
            // 将websocket的id返回给浏览器
            let connectionId = this.wsMockRepository.newConnectionId(userId);

            debugClient.emit('connection-id', connectionId);
            // 用户关闭ws界面
            debugClient.on('disconnect', _ => {
                this.wsMockRepository.connectionClosed(userId, connectionId);
            });
            debugClient.emit('sessions',this.wsMockRepository.getSessions(userId));
        });

        this.wsMockRepository.on("page-connected", (userId, sessionId) => {
            this.wsMockRepository.to(userId).emit('page-connected', sessionId);
        });
        this.wsMockRepository.on("page-msg", (userId, sessionId, data) => {
            this.wsMockRepository.to(userId).emit('page-msg', sessionId, data);
        });
        this.wsMockRepository.on("page-closed", (userId, sessionId) => {
            this.wsMockRepository.to(userId).emit('page-closed', sessionId);
        });
        this.wsMockRepository.on("sessions", (userId, sessions) => {
            this.wsMockRepository.to(userId).emit('sessions', sessions);
        });
    }

    /**
     * break point
     * @param socketIOConn
     * @returns {*|string}
     * @private
     */
    _initBreakpoint() {
        this.breakpointNS = this.io.of('/breakpoint');
        this.breakpointNS.on('connection', client => {

            let userId = this._getUserId(client);
            client.join(userId, err => {
            });

            let connectionId = this.breakpointRepository.newConnectionId(userId);

            client.emit('connection-id', connectionId);
            // 用户关闭断点界面  关闭该链接相关的所有断点
            client.on('disconnect', _ => {
                this.breakpointRepository.connectionClosed(userId, connectionId);
            });
            // 发送当前所有的断点
            client.emit('breakpoints',this.breakpointRepository.getUserBreakPoints(userId));
        });

        this.breakpointRepository.on('instance-add', (userId, instance) => {
            this.breakpointRepository.to(userId).emit('instance-add', instance);
        });
        this.breakpointRepository.on('instance-client-request', (userId, instanceId, content) => {
            this.breakpointRepository.to(userId).emit('client-request', instanceId, content);
        });
        this.breakpointRepository.on('instance-server-response', (userId, instanceId, content) => {
            this.breakpointRepository.to(userId).emit('server-response', instanceId, content);
        });
        this.breakpointRepository.on('instance-end', (userId, instanceId) => {
            this.breakpointRepository.to(userId).emit('instance-end', instanceId);
        });

        this.breakpointRepository.on('breakpoint-save', (userId, breakpoint) => {
            this.breakpointRepository.to(userId).emit('breakpoint-save', breakpoint);
        });
        this.breakpointRepository.on('breakpoint-delete', (userId, breakpointId) => {
            this.breakpointRepository.to(userId).emit('breakpoint-delete', breakpointId);
        });
    }

    // 通用函数，获取socket连接中的用户id
    _getUserId(socketIOConn) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie);
        return cookies['userId'] || '0';
    }
}
