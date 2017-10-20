const path = require("path");
const EventEmitter = require("events");
const _ = require("lodash");
module.exports = class AppInfo extends EventEmitter {

    constructor(mode) {
        super();
        /**
         * 是否运行在服务器端
         * @returns {boolean}
         */
        this.single = mode == 'single' ? true : false;
        // 用户home目录
        let userHome = process.env.HOME || process.env.USERPROFILE;
        // proxy data存放目录
        this.proxyDataDir = path.join(userHome, ".front-end-proxy");
        // app信息
        this.appInfo = {
            "mode": mode,
            "proxyPort": 8001,
            "realUiPort": "",
            "realProxyPort": "",
            "pcIp": "",
            "requestTimeoutTime": 10000,
            "gitlabToken": "",
        };

        this.appDir = path.join(__dirname, "../../../")
    }

    start(){

    }

    getAppDir() {
        return this.appDir;
    }

    /**
     * 设置app 运行信息
     * @param info
     */
    setAppInfo(info) {
        _.assign(this.appInfo, info);
        this.emit('data-change', this.appInfo)
    }

    /**
     * 是否是单用户模式
     * @returns {boolean|*}
     */
    isSingle() {
        return this.single;
    }

    /**
     * 本地存放数据的目录
     * @returns {*}
     */
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

    /**
     * 真实的 ui 端口
     * @returns {string}
     */
    getRealUiPort() {
        return this.appInfo.realUiPort;
    }

    /**
     * 设置真实的 ui 端口
     * @param uiport
     */
    setRealUiPort(uiport) {
        this.setAppInfo({
            realUiPort: uiport
        });
    }

    /**
     * 真实的代理端口
     * @returns {string}
     */
    getRealProxyPort() {
        return this.appInfo.realProxyPort;
    }

    /**
     * 设置正在运行的代理端口
     * @param proxyport
     */
    setRealProxyPort(proxyport) {
        this.setAppInfo({
            realProxyPort: proxyport
        });
    }

    /**
     * 设置机器ip
     * @param pcIp
     */
    setPcIp(pcIp) {
        this.setAppInfo({
            pcIp: pcIp
        });
    }

    /**
     * 获取机器ip
     * @returns {string}
     */
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
}