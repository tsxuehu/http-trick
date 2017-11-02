const getPort = require("get-port");
const ServiceRegistry = require("./core/service/index");
const HttpServer = require("./core/proxy/httpServer");
const HttpsServer = require("./core/proxy/httpsServer");
const WebUiServer = require("./core/uiServer");

// 基于文件的service导入
const FileAppInfoService = require("./impl/file/appInfoService");
const FileBreakpointService = require("./impl/file/breakpointService");
const FileCertificationService = require("./impl/file/certificationService");
const FileConfigureService = require("./impl/file/configureService");
const FileFilterService = require("./impl/file/filterService");
const FileHostService = require("./impl/file/hostService");
const FileHttpTrafficService = require("./impl/file/httpTrafficService");
const FileLogService = require("./impl/file/logService");
const FileMockDataService = require("./impl/file/mockDataService");
const FileRuleService = require("./impl/file/ruleService");
const FileUserService = require("./impl/file/userService");
const FilewsMockService = require("./impl/file/wsMockService");

module.exports = class Launcher {
    /**
     * @param port 代理端口号
     * @param serviceType 使用的服务类型
     * @param isSingle 是否是单用户模式
     */
    constructor(port, serviceType = "file", userMode = "single") {
        this.serviceType = serviceType;
        this.single = userMode != "multi";
        this.port = port;
    }

    /**
     * 启动代理
     * @param port
     */
    async start() {
        await this._initService();
        await this._startServer();
    }

    // 初始化各种服务
    async _initService() {
        let appInfoService;
        let breakpointService;
        let certificationService;
        let configureService;
        let filterService;
        let hostService;
        let httpTrafficService;
        let logService;
        let mockDataService;
        let ruleService;
        let userService;
        let wsMockService;
        if (this.serviceType == "db") {
            // 基于数据库的服务

        } else if (this.serviceType == "db-cluster") {
            // 基于数据库的服务 集群版

        } else {
            // 基于文件的服务

            // 基础服务
            logService = new FileLogService();
            appInfoService = new FileAppInfoService(this.single);
            userService = new FileUserService();
            let baseService = {logService, appInfoService, userService};
            // 复合服务
            breakpointService = new FileBreakpointService(baseService);
            certificationService = new FileCertificationService(baseService);
            configureService = new FileConfigureService(baseService);
            filterService = new FileFilterService(baseService);
            hostService = new FileHostService(baseService);
            httpTrafficService = new FileHttpTrafficService(baseService);
            mockDataService = new FileMockDataService(baseService);
            ruleService = new FileRuleService({configureService, ...baseService});
            wsMockService = new FilewsMockService(baseService);
        }

        // 启动服务
        await appInfoService.start();
        await breakpointService.start();
        await certificationService.start();
        await configureService.start();
        await filterService.start();
        await hostService.start();
        await httpTrafficService.start();
        await logService.start();
        await mockDataService.start();
        await ruleService.start();
        await userService.start();
        await wsMockService.start();

        // 注册服务
        ServiceRegistry.registeServices({
            appInfoService,
            breakpointService,
            certificationService,
            configureService,
            filterService,
            hostService,
            httpTrafficService,
            logService,
            mockDataService,
            ruleService,
            userService,
            wsMockService,
        });
    }

    // 初始化服务器
    async _startServer() {
        this.configureRepository = ServiceRegistry.getConfigureService();
        this.appInfoService = ServiceRegistry.getAppInfoService();
        this.configureService = ServiceRegistry.getConfigureService();

        // 如果不存在 则从配种中取默认值
        if (!this.port) {
            this.port = this.configureService.getProxyPort();
        }
        // 记录运行时的代理端口
        this.appInfoService.setRealProxyPort(this.port);

        let httpsPort = await getPort(40005);

        // 启动http转发服务器
        await new HttpServer(port, httpsPort).start();

        // 启动https转发服务器
        await new HttpsServer(httpsPort).start();

        let webUiPort = await getPort(40001);

        // 设置运行时的用户界面端口
        this.appInfoService.setRealUiPort(webUiPort);

        // 启动web ui
        await new WebUiServer(webUiPort).start();
    }
}