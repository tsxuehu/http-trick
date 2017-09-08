/**
 * Created by tsxuehu on 8/3/17.
 */
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import * as appInfo from "../../appInfo";

// 启动的时候先清空请求记录目录
rimraf.sync(appInfo.tempDir);
fs.mkdirSync(appInfo.tempDir);

export default class logRepository {

    constructor() {
        this.cache = {};
        // 创建定时任务，推送日志记录
        setInterval(function () {
            if (queue.length) {
                // 合并提高性能
                var rsReq = {
                    type: 'req',
                    rows: []
                };
                var rsRes = {
                    type: 'res',
                    rows: []
                };
                _.each(queue, function (item) {
                    if (item.type == 'req') {
                        rsReq.rows = rsReq.rows.concat(item.rows);
                    } else if (item.type == 'res') {
                        rsRes.rows = rsRes.rows.concat(item.rows);
                    }
                });
                var rs = [rsReq, rsRes];
                // console.log(rs);
                uiserver.sentToClientRequest(rs);
                // socket.emit('proxy', queue);
                queue = [];
            }
        }, 2500);
    }

    /**
     * 获取请求的请求内容
     * @param userId
     * @param requestId
     */
    getResponseBody(userId, requestId) {
        var saveResponseDirPath = dc.getSaveResponseDirPath();
        var filepath = path.join(saveResponseDirPath, id + '_res_body');
    }

    // 数据中心监控
    hasMonitor(clientIp) {
        return store.runtimeInfo.storeMonitorCnt > 0;
    }

    incMonitor(userId) {
        return store.runtimeInfo.storeMonitorCnt++;
    }

    decMonitor(userId) {
        return store.runtimeInfo.storeMonitorCnt--;
    }

    /**
     * 获取 http 请求id
     * @param clientIp
     */
    getHttpTrafficId(clientIp){

    }

    request({clientIp, id, req, res, urlObj}) {

        let {protocol, host, pathname, port} = urlObj;

        let queue = this.cache[clientIp] || [];
        queue.push({
            id: id,
            result: '-', // 状态码
            protocol: protocol.toUpperCase(),
            host: host,
            url: req.url,
            port,
            path: path,
            pathname: pathname,
            method: req.method,
            httpVersion: req.httpVersion,
            reqHeaders: req.headers,
            reqTime: +new Date()
        });

        this.cache[clientIp] = queue;
    }

    reqBody({clientIp, id, req, res, body}) {
        // 将body写文件
        let bodyPath = path.join(appInfo.tempDir, id + '_req_body');
        fs.writeFile(bodyPath, body, 'binary', function (err) {
            if (err) throw err;
        });
    }

    response({clientIp, id, req, res, responseContent}) {

        let queue = this.cache[clientIp] || [];

        let expires = res.getHeader('expires');
        queue.push({
            id: id,
            result: res.statusCode,
            body: res.getHeader('content-length') || (body && body.length) || 0,
            caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + expires : ''),
            contentType: res.getHeader('content-type') || '',
            resHeaders: res._headers,
            resTime: +new Date()
        });

        this.cache[clientIp] = queue;

        let bodyPath = path.join(appInfo.tempDir, id + '_res_body');
        fs.writeFile(bodyPath, responseContent, 'binary', function (err) {
            if (err) throw err;
        });
    }
}