import {Service} from "di/annotation";
import {IAppInfo} from "./app-info";
import path from "path";
import assign from "lodash/assign";
import ip from 'ip';
import EventEmitter from "events";
import {IOriginRequestData} from "service/intercept/http";

@Service()
export default class AppInfoService extends EventEmitter {
    private appDir: string
    private proxyDataDir: string // 本地存放数据的目录
    private appInfo: IAppInfo

    constructor() {
        super();
        const userHome = (process.env.HOME || process.env.USERPROFILE) as string;
        this.proxyDataDir = path.join(userHome, ".http-trick");
        this.appDir = path.join(__dirname, "../../");
        this.appInfo = {
            appName: 'Http-Trick',
            single: true,
            httpProxyPort: 0,
            httpsProxyPort: 0,
            socks5ProxyPort: 0,
            dnsPort: 0,
            webUiPort: 0,
            startHttpProxy: true,
            startSocks5: true,
            startDns: false,
            pcIp: "",
        }
    }

    async start() {
        this.setAppInfo({
            pcIp: ip.address()
        })
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
        console.log(`Manager: http://${pcIp}:${webUiPort}`);
    }
}
