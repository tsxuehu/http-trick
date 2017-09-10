import path from "path";
/**
 * Created by tsxuehu on 8/3/17.
 */
export default class RuntimeInfoRepository {


    constructor(mode){
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

    /**
     * 获取保存请求记录的目录
     * @param clientIp
     */
    getSaveResponseDirPath(clientIp) {

    }

    getRealUiPort() {
        return this.realUiPort;
    }

    setRealUiPort(uiport) {
        this.realUiPort = uiport;
    }

    getRealProxyPort() {
        return this.realProxyPort;
    }

    setRealProxyPort(proxyport) {
        this.realProxyPort = proxyport;
    }

    setPcIp(pcIp) {
        this.pcIp = pcIp;
    }

    getPcIp() {
        return this.pcIp;
    }

    getRuntimeInfo() {
        return store.runtimeInfo;
    }


   

    // ws mock 客户端
    hasWsMockClient() {
        return store.runtimeInfo.wsMockCnt > 0;
    }

    /**
     * @param id 客户端编号
     * @returns {number}
     */
    inWsMockClient() {
        store.runtimeInfo.wsMockCnt++;
    }

    /**
     * @param id 客户端编号
     * @returns {number}
     */
    outWsMockClient() {
        store.runtimeInfo.wsMockCnt--;
    }
}