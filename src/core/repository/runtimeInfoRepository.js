/**
 * Created by tsxuehu on 8/3/17.
 */
export default class RuntimeInfoRepository {

    /**
     * 用户新开一个HttpTrafficMonitor窗口
     */
    incHttpTrafficMonitor(userId) {

    }

    /**
     * 用户关闭一个HttpTrafficMonitor窗口
     * @param userId
     */
    decHttpTrafficMonitor(userId) {

    }

    /**
     * 用户是否有HttpTrafficMonitor窗口
     * @param userId
     */
    hasHttpTrafficMonitor(userId) {

    }

    /**
     * 获取 http 请求id
     * @param clientIp
     */
    getHttpTrafficId(clientIp){

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


    // 数据中心监控
    hasStoreMonitor() {
        return store.runtimeInfo.storeMonitorCnt > 0;
    }

    inStoreMonitor() {
        return store.runtimeInfo.storeMonitorCnt++;
    }

    outStoreMonitor() {
        return store.runtimeInfo.storeMonitorCnt--;
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