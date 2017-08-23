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
        return store.runtimeInfo.realUiPort;
    }

    setRealUiPort(uiport) {
        store.runtimeInfo.realUiPort = uiport;
    }

    getRealProxyPort() {
        return store.runtimeInfo.realProxyPort;
    }

    setRealProxyPort(proxyport) {
        store.runtimeInfo.realProxyPort = proxyport;
    }

    setPcIp(pcIp) {
        store.runtimeInfo.pcIp = pcIp;
    }

    getPcIp() {
        return store.runtimeInfo.pcIp;
    }

    getRuntimeInfo() {
        return store.runtimeInfo;
    }

    // 是否有监控http请求的窗口
    hasHttpTraficMonitor() {
        return store.runtimeInfo.httpTraficMonitorCnt > 0;
    }

    inHttpTraficMonitor() {
        return store.runtimeInfo.httpTraficMonitorCnt++;
    }

    outHttpTraficMonitor() {
        return store.runtimeInfo.httpTraficMonitorCnt--;
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