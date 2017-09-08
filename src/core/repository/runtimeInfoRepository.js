/**
 * Created by tsxuehu on 8/3/17.
 */
export default class RuntimeInfoRepository {



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