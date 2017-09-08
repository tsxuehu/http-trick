import path from "path";

let appInfo;
export default class AppInfo {
    static getAppInfo() {
        if (!appInfo) {
            appInfo = new AppInfo();
        }
        return appInfo;
    }

    constructor() {
        /**
         * 是否运行在服务器端
         * @returns {boolean}
         */
        this.isServer = false;

        let userHome = process.env.HOME || process.env.USERPROFILE;

        this.proxyDataDir = path.join(userHome, ".front-end-proxy");
        // 配置目录
        this.tempDir = path.join(proxyDataDir, "temp"); // http请求存放目录
        this.confDir = path.join(proxyDataDir, "conf"); // conf请求存放目录
    }

    getIsServer() {
        return this.isServer;
    }

    setIsServer(isServer) {
        this.isServer = isServer;
    }

    getProxyDataDir() {
        return this.proxyDataDir;
    }
}