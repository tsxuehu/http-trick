const getPort = require("get-port");
const ServiceRegistry = require("./core/service/index");
const HttpServer = require("./httpServer");
const HttpsServer = require("./httpsServer");
const WebUiServer = require("./webui");

// service导入
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
     * 设置repositories
     * @param repositories
     */
    constructor(port, repositories) {
        this.serviceType = "file";
        this.userMode = "single";

        ServiceRegistry.registeServices(repositories);
        this.configureRepository = ServiceRegistry.getConfigureService();
        this.appInfoService = ServiceRegistry.getAppInfoService();
        this.configureService = ServiceRegistry.getConfigureService();
        this.port = port;
    }

    /**
     * 启动代理
     * @param port
     */
    async start() {
        // 如果不存在 则从datacenter取默认值
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

    // 初始化各种服务
    _initService() {
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
        }

        if (this.userMode == "single") {
            // 单用户模式
        } else {
            // 多用户模式

        }

        // 启动服务

    }

    // 初始化服务器
    _startServer() {

    }
}