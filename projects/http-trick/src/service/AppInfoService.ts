import {Resource, Service} from "@spring4js/container-node";
import {IAppInfo} from "./app-info";
import path from "path";
import assign from "lodash/assign";
import EventEmitter from "events";
import {IOriginRequestData} from "service/intercept/http";
import FileService from "service/infra/FileService";

@Service()
export default class AppInfoService extends EventEmitter {

    @Resource() private fileService: FileService

    private appDir: string
    private proxyDataDir: string // 本地存放数据的目录
    private appInfo: IAppInfo = {
        appName: 'Http-Trick',
        single: true,
        httpProxyPort: 0,
        httpsProxyPort: 0,
        socks5ProxyPort: 0,
        dnsPort: 0,
        webUiPort: 0,
        startHttpProxy: false,
        startSocks5: false,
        startDns: false,
        pcIp: "",
    }

    async start() {
        // 初始化
        const userHome = (process.env.HOME || process.env.USERPROFILE) as string;
        this.proxyDataDir = path.join(userHome, ".http-trick");
        this.appDir = path.join(__dirname, "../../");

        const proxyDataDir = this.proxyDataDir;
        const exists = await this.fileService.exists(proxyDataDir);
        if (!exists) {
            await this.fileService.makeDir(proxyDataDir);
            await this.fileService.makeDir(path.join(proxyDataDir, "certificate"));
            await this.fileService.makeDir(path.join(proxyDataDir, "host"));
            await this.fileService.makeDir(path.join(proxyDataDir, "rule"));
            await this.fileService.makeDir(path.join(proxyDataDir, "mock-data"));
            await this.fileService.makeDir(path.join(proxyDataDir, "mock-list"));
            await this.fileService.makeDir(path.join(proxyDataDir, "profile"));
            await this.fileService.makeDir(path.join(proxyDataDir, "filter"));
            await this.fileService.makeDir(path.join(proxyDataDir, "traffic"));
            await this.fileService.makeDir(path.join(proxyDataDir, "rootCA"));

            await this.fileService.writeJsonToFile(path.join(proxyDataDir, "deviceInfo.json"), {});
            await this.fileService.writeJsonToFile(path.join(proxyDataDir, "configure.json"), {});
        }
    }

    getAppName() {
        return this.appInfo.appName;
    }

    getAppDir() {
        return this.appDir;
    }

    setAppInfo(info: Partial<IAppInfo>) {
        assign(this.appInfo, info);
        this.emit('data-change', this.appInfo);
    }

    isSingle(): boolean {
        return this.appInfo.single
    }

    getProxyDataDir() {
        return this.proxyDataDir;
    }

    getHttpProxyPort() {
        return this.appInfo.httpProxyPort;
    }

    getHttpsProxyPort() {
        return this.appInfo.httpsProxyPort;
    }

    getWebUiPort() {
        return this.appInfo.webUiPort;
    }

    setHttpsProxyPort(httpsProxyPort: number) {
        this.setAppInfo({
            httpsProxyPort: httpsProxyPort
        });
    }

    getPcIp() {
        return this.appInfo.pcIp;
    }

    getAppInfo() {
        return this.appInfo;
    }

    // 是否是webui请求
    isWebUiRequest(originRequestData: IOriginRequestData): boolean {
        const {hostname, port} = originRequestData
        return (hostname == '127.0.0.1' || hostname == this.appInfo.pcIp)
            && +port == this.appInfo.webUiPort;
    }

    printRuntimeInfo() {
        let {
            appName,
            single,
            httpProxyPort,
            httpsProxyPort,
            socks5ProxyPort,
            dnsPort,
            webUiPort,
            startHttpProxy,
            startSocks5,
            startDns,
            pcIp,
        } = this.appInfo;
        startHttpProxy && console.log(`Http Proxy Port: ${httpProxyPort}`);
        startSocks5 && console.log(`Socks5 Proxy Port: ${socks5ProxyPort}`);
        startDns && console.log(`DNS Port: ${dnsPort}`);
        console.log(`IP: ${pcIp}`);
        console.log(`Manager: http://${pcIp}:${webUiPort}/index.html`);
    }
}
