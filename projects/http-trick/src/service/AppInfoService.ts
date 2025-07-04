import {Service} from "di/annotation";
import {IAppInfo} from "./app-info";
import path from "path";
import StateBase from "../utils/StateBase";
import ip from 'ip';

@Service()
export default class AppInfoService extends StateBase<IAppInfo> {
    private appDir: string
    private proxyDataDir: string // 本地存放数据的目录

    constructor() {
        super({
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
        })
        const userHome = (process.env.HOME || process.env.USERPROFILE) as string;
        this.proxyDataDir = path.join(userHome, ".http-trick");
        this.appDir = path.join(__dirname, "../../");
    }

    async start() {
        this.setState({
            pcIp: ip.address()
        })
    }

    getAppName() {
        return this.getState().appName;
    }

    getAppDir() {
        return this.appDir;
    }

    setAppInfo(info: Partial<IAppInfo>) {
        this.setState(info)
    }

    isSingle(): boolean {
        const state = this.getState()
        return state.single
    }

    getProxyDataDir() {
        return this.proxyDataDir;
    }

    getHttpProxyPort() {
        return this.getState().httpProxyPort;
    }

    getHttpsProxyPort() {
        return this.getState().httpsProxyPort;
    }

    setHttpsProxyPort(httpsProxyPort: number) {
        this.setState({
            httpsProxyPort: httpsProxyPort
        });
    }

    getPcIp() {
        return this.getState().pcIp;
    }

    getAppInfo() {
        return this.getState();
    }

    // 是否是webui请求
    isWebUiRequest(hostname: string, port: number) {
        return (hostname == '127.0.0.1' || hostname == this.getState().pcIp)
            && port == this.getState().webUiPort;
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
        } = this.getState();
        startHttpProxy && console.log(`Http Proxy Port: ${httpProxyPort}`);
        startSocks5 && console.log(`Socks5 Proxy Port: ${socks5ProxyPort}`);
        startDns && console.log(`DNS Port: ${dnsPort}`);
        console.log(`IP: ${pcIp}`);
        console.log(`Manager: http://${pcIp}:${webUiPort}`);
    }
}
