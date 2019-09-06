const http = require("http");
const koa = require("koa");
const path = require("path");
const koaBody = require("koa-body");
const koaQs = require("koa-qs");
const staticServe = require("koa-static");
const router = require("./router");
const SocketIO = require("socket.io");
const cookieParser = require("cookie");
const ServiceRegistry = require("../../service");
const socketIp = require("../../utils/socketIp");

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
        this.appInfoService = ServiceRegistry.getAppInfoService();
        // 初始化koa
        this.app = new koa();
        // 身份识别
        this.app.use(async (ctx, next) => {
            let userId = 'root';
            if (!this.appInfoService.isSingle()) {
                let cookies = cookieParser.parse(ctx.request.headers.cookie || "");
                userId = cookies['userId'];
                if (!userId) {
                    // 多用户模式 则把用户的ip当做id
                    let ip;
                    // 取x-forword-for
                    ip = ctx.request.headers['x-forwarded-for'];
                    if (!ip) {
                        ip = socketIp.getRemoteIp(ctx.req.socket);
                    }
                    if (ip.indexOf(',') > -1) {
                        ip = ip.split(',')[0];
                    }
                    userId = ip;
                    // 当前机器的ip和用户id绑定. 当机器为ip的机器发代理请求时，会使用userId用户的规则
                    ctx.cookies.set('userId', userId, {maxAge: 1000 * 60 * 60 * 24 * 365});
                }
            }
            ctx.userId = userId;
            await next();
        });
        // query string
        koaQs(this.app);
        // body解析
        this.app.use(koaBody({multipart: true}));
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
        this._initManager();
    }

    async start() {
        // 启动server
        this.server.listen(this.webUiPort);
    }

    // http流量监控界面
    _initTraffic() {
        this.httpTraficMonitorNS = this.io.of('/httptrafic');
        // 客户端发起连接请求
        this.httpTraficMonitorNS.on('connection', async client => {

            let userId = this._getUserId(client);
            client.join(userId, err => {
            });

            this.httpTrafficService.incMonitor(userId);

            let deviceList = await this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
            // host文件列表
            let hostFileList = await this.hostService.getHostFileList(userId);
            client.emit('hostfilelist', hostFileList);

            // 推送过滤器，状态
            let state = this.httpTrafficService.getStatus(userId);
            client.emit('state', state);
            let filter = this.httpTrafficService.getFilter(userId);
            client.emit('filter', filter);
            client.emit('clear');
            client.on('disconnect', () => {
                this.httpTrafficService.decMonitor(userId);
            });
        });

        // 监听logRespository事件
        this.httpTrafficService.on('traffic', (userId, rows) => {
            this.httpTraficMonitorNS.to(userId).emit('rows', rows);
        });
        // 过滤器改变
        this.httpTrafficService.on('filter', (userId, filter) => {
            this.httpTraficMonitorNS.to(userId).emit('filter', filter);
        });
        // 状态改变
        this.httpTrafficService.on('state-change', (userId, state) => {
            this.httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 清空
        this.httpTrafficService.on('clear', (userId) => {
            this.httpTraficMonitorNS.to(userId).emit('clear');
            let state = this.httpTrafficService.getStatus(userId);
            this.httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 推送设备列表信息
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            this.httpTraficMonitorNS.to(userId).emit('bindedDeviceList', deviceList);
        });

        // host文件变化
        this.hostService.on("data-change", (userId, hostFilelist) => {
            this.httpTraficMonitorNS.to(userId).emit('hostfilelist', hostFilelist);
        });
    }

    // 管理界面 使用的功能
    _initManager() {
        this.managerNS = this.io.of('/manager');

        // 注册通知
        this.managerNS.on('connection', async client => {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            // 推送最新数据
            // 运行信息
            let appInfo = this.appInfoService.getAppInfo();
            client.emit('appinfo', appInfo);
            // proxy配置
            let config = await this.configureService.getConfigure();
            client.emit('configure', config);
            // 个人配置
            let profile = await this.profileService.getProfile(userId);
            client.emit('profile', profile);
            let deviceList = await this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
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
        this.configureService.on("data-change", (userId, configure) => {
            this.managerNS.to(userId).emit('configure', configure);
        });
        // 个人配置信息
        this.profileService.on("data-change-profile", (userId, profile) => {
            this.managerNS.to(userId).emit('profile', profile);
        });
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            this.managerNS.to(userId).emit('bindedDeviceList', deviceList);
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

    // 通用函数，获取web socket连接中的用户id
    _getUserId(socketIOConn) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie || "");
        return cookies['userId'] || 'root';
    }
};
