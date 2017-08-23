import getPort from "get-port";
import Repository from "../repository";
import HttpServer from "./httpServer";
import HttpsServer from "./httpsServer";
import WebUiServer from "./webui";
export default class Launcher {
    /**
     * 设置repositories
     * @param repositories
     */
    constructor(port, repositories) {
        Repository.setRepositories(repositories);
        this.configureRepository = Repository.getConfigureRepository();
        this.runtimeInfoRepository = Repository.getRuntimeInfoRepository();
        this.port = port;
    }

    /**
     * 启动代理
     * @param port
     */
    async start() {
        // 如果不存在 则从datacenter取默认值
        if (!this.port) {
            this.port = this.configureRepository.getProxyPort();
        }
        // 记录运行时的代理端口
        this.runtimeInfoRepository.setRealProxyPort(this.port);

        let httpsPort = await getPort(40005);

        // 启动http转发服务器
        await new HttpServer(port, httpsPort).start();

        // 启动https转发服务器
        await new HttpsServer(httpsPort).start();

        let webUiPort = await getPort(40001);

        // 设置运行时的用户界面端口
        this.runtimeInfoRepository.setRealUiPort(webUiPort);

        // 启动web ui
        await new WebUiServer(webUiPort).start();
    }
}