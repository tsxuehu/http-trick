import path from "path";
import _ from "lodash";
export default class AppInfo {

    constructor(mode) {
        /**
         * 是否运行在服务器端
         * @returns {boolean}
         */
        this.isDesktop = mode == 'desktop' ? true : false;

        let userHome = process.env.HOME || process.env.USERPROFILE;

        this.proxyDataDir = path.join(userHome, ".front-end-proxy");
        // 配置目录
        this.tempDir = path.join(this.proxyDataDir, "temp"); // http请求存放目录
        this.confDir = path.join(this.proxyDataDir, "conf"); // conf请求存放目录

        this.appInfo = {
            "mode": mode,
            "proxyPort": 8001,
            "realUiPort": "",
            "realProxyPort": "",
            "pcIp": "",
            "requestTimeoutTime": 10000,
            "gitlabToken": "",
        };
    }

    setAppInfo(info) {
        _.assign(this.appInfo, info);
        this.emit('data-change', this.appInfo)
    }

    isDesktop() {
        return this.isDesktop;
    }

    getProxyDataDir() {
        return this.proxyDataDir;
    }

    /**
     * 获取gitlab token
     * @param userId
     */
    getGitlabToken() {
        return this.appInfo.gitlabToken;
    }

    getRealUiPort() {
        return this.appInfo.realUiPort;
    }

    setRealUiPort(uiport) {
        this.setAppInfo({
            realUiPort: uiport
        });
    }

    getRealProxyPort() {
        return this.appInfo.realProxyPort;
    }

    setRealProxyPort(proxyport) {
        this.setAppInfo({
            realProxyPort: proxyport
        });
    }

    setPcIp(pcIp) {
        this.setAppInfo({
            pcIp: pcIp
        });
    }

    getPcIp() {
        return this.appInfo.pcIp;
    }

    /**
     * 代理超时时间
     * @param clientIp
     * @returns {number}
     */
    getRequestTimeoutTime() {
        return this.appInfo.requestTimeoutTime;
    }

    /**
     * 获取端口号
     */
    getProxyPort() {
        return this.appInfo.proxyPort;
    }
}