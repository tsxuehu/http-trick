const getPort = require("get-port");
const ServiceRegistry = require("./core/service/index");
const HttpServer = require("./httpServer");
const HttpsServer = require("./httpsServer");
const WebUiServer = require("./webui");
module.exports = class Launcher {
    /**
     * 设置repositories
     * @param repositories
     */
    constructor(port, repositories) {
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
}