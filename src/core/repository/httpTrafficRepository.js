/**
 * Created by tsxuehu on 8/3/17.
 */
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import _ from "lodash";
import * as fileUtil from "../utils/file";

export default class HttpTrafficRepository {

    constructor(userRepository, appInfoRepository) {
        this.userRepository = userRepository;
        this.appInfoRepository = appInfoRepository;
        this.cache = {};
        this.userRequestPointer = {};
        this.userMonitorCount = {};
        let proxyDataDir = this.appInfoRepository.getProxyDataDir();
        this.trafficDir = path.join(proxyDataDir, "traffic");
        // 创建定时任务，推送日志记录
        setInterval(_ => {
            this.sendCachedData();
        }, 2500);
    }

    sendCachedData() {
        _.forEach(this.cache, async (rows, clientIp) => {
            let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
            this.emit("traffic", userId, rows);
        });
        this.cache = {};
    }


    // 为请求分配id
    async getRequestId(clientIp) {
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);

        let id = this.userRequestPointer[userId] || 0;
        // 超过500个请求则不再记录
        if (id > 500) return -1;

        id++;
        this.userRequestPointer[userId] = id;
        return id;
    }

    resetRequestId(userId) {
        this.userRequestPointer[userId] = 0;
    }

    // 数据中心监控
    async hasMonitor(clientIp) {
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
        let cnt = this.userMonitorCount[userId] || 0;
        return cnt > 0;
    }

    incMonitor(userId) {
        let cnt = this.userMonitorCount[userId] || 0;
        cnt++;
        this.userMonitorCount[userId] = cnt;
    }

    decMonitor(userId) {
        let cnt = this.userMonitorCount[userId] || 0;
        cnt--;
        this.userMonitorCount[userId] = cnt;
    }

    request({clientIp, id, req, res, urlObj}) {

        let {protocol, host, pathname, port} = urlObj;

        let queue = this.cache[clientIp] || [];
        queue.push({
            id: id,
            start: true, // 请求开始的标记
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

    async reqBody({clientIp, id, req, res, body}) {
        // 将body写文件
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);

        let bodyPath = this.getRequestBodyPath(userId, id);
        await fileUtil.writeFile(bodyPath, body);
    }

    async response({clientIp, id, req, res, responseContent}) {

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
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);

        let bodyPath = this.getResponseBodyPath(userId, id);
        await fileUtil.writeFile(bodyPath, responseContent);
    }

    // 启动的时候先清空请求记录目录
    clearTraffic() {
        rimraf.sync(this.trafficDir);
        fs.mkdirSync(this.trafficDir);
    }

    /**
     * 获取请求的请求内容
     * @param userId
     * @param requestId
     */
    async getRequestBody(userId, requestId) {
        let saveRequestPath = this.getRequestBodyPath(userId, requestId);
        return await fileUtil.readFile(saveRequestPath);
    }

    /**
     * 获取请求的请求内容
     * @param userId
     * @param requestId
     */
    async getResponseBody(userId, requestId) {
        let saveResponsePath = this.getResponseBodyPath(userId, requestId);
        return await fileUtil.readFile(saveResponsePath);
    }

    getRequestBodyPath(userId, requestId) {
        return path.join(this.trafficDir, userId + '_' + requestId + '_req_body');
    }

    getResponseBodyPath(userId, requestId) {
        return path.join(this.trafficDir, userId + '_' + requestId + '_res_body');
    }
}