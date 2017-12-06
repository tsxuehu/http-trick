const http = require("http");
const koa = require("koa");
const path = require("path");
const koaBody = require("koa-body");
const koaQs = require("koa-qs");
const staticServe = require("koa-static");
const router = require("./router");
const SocketIO = require("socket.io");
const cookieParser = require("cookie");
const ServiceRegistry = require("../service");

module.exports = class UiServer {

    constructor(webUiPort) {
        this.webUiPort = webUiPort;

        // 引用服务
        this.httpTrafficService = ServiceRegistry.getHttpTrafficService();
        this.configureService = ServiceRegistry.getConfigureService();
        this.profileService = ServiceRegistry.getProfileService();
        this.hostService = ServiceRegistry.getHostService();
        this.mockDataService = ServiceRegistry.getMockDataService();
        this.ruleService = ServiceRegistry.getRuleService();
        this.filterService = ServiceRegistry.getFilterService();
        this.wsMockService = ServiceRegistry.getWsMockService();
        this.breakpointService = ServiceRegistry.getBreakpointService();

        // 初始化koa
        this.app = new koa();
        // query string
        koaQs(this.app);
        // body解析
        this.app.use(koaBody({ multipart: true }));
        // 路由
        this.app.use(router());
        // 静态资源服务
        this.app.use(staticServe(path.join(__dirname, '../../../site')));
        // 创建server
        this.server = http.createServer(this.app.callback());
        // socketio
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
        // 客户端发起连接请求
        this.httpTraficMonitorNS.on('connection', client => {

            let userId = this._getUserId(client);
            client.join(userId, err => {
            });

            this.httpTrafficService.incMonitor(userId);
            this.httpTrafficService.resetRequestId(userId);

            client.on('disconnect',  () => {
                this.httpTrafficService.decMonitor(userId);
            });
        });

        // 监听logRespository事件
        this.httpTrafficService.on('traffic', (userId, rows) => {
            this.httpTraficMonitorNS.to(userId).emit('rows', rows);
        });
    }

    // 管理界面 使用的功能
    _initManger() {
        this.managerNS = this.io.of('/manager');

        // 注册通知
        this.managerNS.on('connection', async client => {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            // 推送最新数据
            // proxy配置
            let config = await this.configureService.getConfigure();
            client.emit('configure', config);
            // 个人配置
            let profile = await this.profileService.getProfile(userId);
            client.emit('profile', profile);
            let mappedClientIps = await this.profileService.getClientIpsMappedToUserId(userId);
            client.emit('mappedClientIps', mappedClientIps);
            // host文件列表
            let hostFileList = await this.hostService.getHostFileList(userId);
            client.emit('hostfilelist', hostFileList);
            // 规则列表
            let ruleFileList = await this.ruleService.getRuleFileList(userId);
            client.emit('rulefilelist', ruleFileList);
            // 数据文件列表
            let dataList = await this.mockDataService.getMockDataList(userId);
            client.emit('datalist', dataList);
            // 过滤器
            let filters = await this.filterService.getFilterRuleList(userId);
            client.emit('filters', filters);
        });
        // proxy配置信息
        this.configureService.on("data-change", (userId,configure) => {
            this.managerNS.to(userId).emit('configure', configure);
        });
        // 个人配置信息
        this.profileService.on("data-change-profile",( userId, profile)=>{
            this.managerNS.to(userId).emit('profile', profile);
        });
        this.profileService.on("data-change-clientIpUserMap",( userId, clientIpList)=>{
            this.managerNS.to(userId).emit('mappedClientIps', clientIpList);
        });
        // host文件变化
        this.hostService.on("data-change", (userId, hostFilelist) => {
            this.managerNS.to(userId).emit('hostfilelist', hostFilelist);
        });
        // 规则文件列表
        this.ruleService.on("data-change", (userId, ruleFilelist) => {
            this.managerNS.to(userId).emit('rulefilelist', ruleFilelist);
        });
        // mock文件列表
        this.mockDataService.on("data-change", (userId, dataFilelist) => {
            this.managerNS.to(userId).emit('datalist', dataFilelist);
        });
        // 过滤器
        this.filterService.on("data-change", (userId, filters) => {
            this.managerNS.to(userId).emit('filters', filters);
        });
    }

    // ws mock 相关函数
    _initWsMock() {
        this.wsmockNS = this.io.of('/wsmock');

        this.wsmockNS.on('connection', async debugClient => {

            let userId = this._getUserId(debugClient);
            debugClient.join(userId, err => {
            });
            // 将websocket的id返回给浏览器
            let connectionId = await this.wsMockService.newConnectionId(userId);
            // 向客户端 发送 连接id
            debugClient.emit('connection-id', connectionId);
            // 向客户端发送当前所有的session
            debugClient.emit('sessions', await this.wsMockService.getSessions(userId));

            // 用户关闭ws界面
            debugClient.on('disconnect', _ => {
                this.wsMockService.connectionClosed(userId, connectionId);
            });
        });

        this.wsMockService.on("page-connected", (userId, sessionId) => {
            this.wsmockNS.to(userId).emit('page-connected', sessionId);
        });
        this.wsMockService.on("page-msg", (userId, sessionId, data) => {
            this.wsmockNS.to(userId).emit('page-msg', sessionId, data);
        });
        this.wsMockService.on("page-closed", (userId, sessionId) => {
            this.wsmockNS.to(userId).emit('page-closed', sessionId);
        });
        this.wsMockService.on("sessions", (userId, sessions) => {
            this.wsmockNS.to(userId).emit('sessions', sessions);
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
            // 获取用户id，将连接加入到用户组
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });

            let connectionId = this.breakpointService.newConnectionId(userId);
            client.emit('connection-id', connectionId);

            // 用户关闭断点界面  关闭该链接相关的所有断点
            client.on('disconnect', _ => {
                this.breakpointService.connectionClosed(userId, connectionId);
            });
            // 发送当前所有的断点
            client.emit('breakpoints', this.breakpointService.getUserBreakPoints(userId));
        });

        this.breakpointService.on('instance-add', (userId, instance) => {
            this.breakpointNS.to(userId).emit('instance-add', instance);
        });
        this.breakpointService.on('set-instance-request-content', (userId, instanceId, content) => {
            this.breakpointNS.to(userId).emit('client-request', instanceId, content);
        });
        this.breakpointService.on('set-instance-server-response', (userId, instanceId, content) => {
            this.breakpointNS.to(userId).emit('server-response', instanceId, content);
        });
        this.breakpointService.on('send-instance-to-client', (userId, instanceId) => {
            this.breakpointNS.to(userId).emit('instance-end', instanceId);
        });
        this.breakpointService.on('breakpoint-save', (userId, breakpoint) => {
            this.breakpointNS.to(userId).emit('breakpoint-save', breakpoint);
        });
        this.breakpointService.on('breakpoint-delete', (userId, breakpointId) => {
            this.breakpointNS.to(userId).emit('breakpoint-delete', breakpointId);
        });
    }

    // 通用函数，获取socket连接中的用户id
    _getUserId(socketIOConn) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie);
        return cookies['userId'] || 'root';
    }
};
