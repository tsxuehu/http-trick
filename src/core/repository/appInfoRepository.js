import path from "path";

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
        this.tempDir = path.join(proxyDataDir, "temp"); // http请求存放目录
        this.confDir = path.join(proxyDataDir, "conf"); // conf请求存放目录
    }

    isDesktop() {
        return this.isDesktop;
    }

    getProxyDataDir() {
        return this.proxyDataDir;
    }
}