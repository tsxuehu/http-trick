/**
 * Created by tsxuehu on 17/2/24.
 */

var path = require('path');
var Vue = require('vue');
var _ = require('lodash');
var file = require('../../utils/file')

module.exports = function (store) {
    return {
        getSaveResponseDirPath: function () {
            return path.join(file.getUserHomeConfDir(), 'tmp');
        },

        getRealUiPort: function () {
            return store.runtimeInfo.realUiPort;
        },

        setRealUiPort: function (uiport) {
            store.runtimeInfo.realUiPort = uiport;
        },

        getRealProxyPort: function () {
            return store.runtimeInfo.realProxyPort;
        },

        setRealProxyPort: function (proxyport) {
            store.runtimeInfo.realProxyPort = proxyport;
        },

        setPcIp: function (pcIp) {
            store.runtimeInfo.pcIp = pcIp;
        },

        getPcIp: function () {
            return store.runtimeInfo.pcIp;
        },

        getRuntimeInfo: function () {
            return store.runtimeInfo;
        },
        // 是否有监控http请求的窗口
        hasHttpTraficMonitor: function () {
            return store.runtimeInfo.httpTraficMonitorCnt > 0;
        },
        inHttpTraficMonitor: function () {
            return store.runtimeInfo.httpTraficMonitorCnt++;
        },
        outHttpTraficMonitor: function () {
            return store.runtimeInfo.httpTraficMonitorCnt--;
        },
        // 数据中心监控
        hasStoreMonitor: function () {
            return store.runtimeInfo.storeMonitorCnt > 0;
        },
        inStoreMonitor: function () {
            return store.runtimeInfo.storeMonitorCnt++;
        },
        outStoreMonitor: function () {
            return store.runtimeInfo.storeMonitorCnt--;
        },
        // ws mock 客户端
        hasWsMockClient: function () {
            return store.runtimeInfo.wsMockCnt > 0;
        },
        /**
         *
         * @param id 客户端编号
         * @returns {number}
         */
        inWsMockClient: function () {
            store.runtimeInfo.wsMockCnt++;
        },
        /**
         *
         * @param id 客户端编号
         * @returns {number}
         */
        outWsMockClient: function () {
            store.runtimeInfo.wsMockCnt--;
        }
    }
};