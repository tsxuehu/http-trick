/**
 * Created by tsxuehu on 8/3/17.
 */
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const logCountPerUser = 500;
const EventEmitter = require("events");
/**
 * 缓存监控数据、发送给监控窗
 * 记录用户打开的监控窗数量
 * 每个用户最多只记录500个请求，超过500个后 不在记录
 * @type {HttpTrafficRepository}
 */
module.exports = class HttpTrafficService extends EventEmitter {

    constructor({ userService, appInfoService }) {
        super();
        this.userService = userService;
        this.appInfoService = appInfoService;
        // http请求缓存数据 userId - > [{record}，{record}，{record}]
        this.cache = {};
        // 用户的请求id  一个用户可以关联多个请求设备，用户的请求分配唯一个一个请求id
        this.userRequestPointer = {};
        // 记录用户的监视窗数量
        this.userMonitorCount = {};

        let proxyDataDir = this.appInfoService.getProxyDataDir();
        // 监控数据缓存目录
        this.trafficDir = path.join(proxyDataDir, "traffic");
        // 创建定时任务，推送日志记录
        setInterval(_ => {
            this.sendCachedData();
        }, 2500);
    }

    start() {
        // 删除缓存

    }

    // 将缓存数据发送给用户
    sendCachedData() {
        _.forEach(this.cache, (rows, userId) => {
            this.emit("traffic", userId, rows);
        });
        this.cache = {};
    }

    // 为请求分配id
    getRequestId(userId) {

        // 获取当前ip
        let id = this.userRequestPointer[userId] || 0;
        // 超过500个请求则不再记录
        if (id > logCountPerUser) return -1;

        id++;
        this.userRequestPointer[userId] = id;
        return id;
    }

    resetRequestId(userId) {
        this.userRequestPointer[userId] = 0;
    }

    // 获取监控窗口的数量，没有监控窗口 则不做记录
    hasMonitor(userId) {
        let cnt = this.userMonitorCount[userId] || 0;
        return cnt > 0;
    }

    // 用户监控窗数加1
    incMonitor(userId) {
        let cnt = this.userMonitorCount[userId] || 0;
        cnt++;
        this.userMonitorCount[userId] = cnt;
    }

    // 用户监控窗数减一
    decMonitor(userId) {
        let cnt = this.userMonitorCount[userId] || 0;
        cnt--;
        this.userMonitorCount[userId] = cnt;
    }

    // 记录请求
    async requestBegin({ userId, clientIp, id, req, urlObj }) {
        let { protocol, host, path, pathname, port } = urlObj;

        let queue = this.cache[userId] || [];
        // 原始请求信息
        queue.push({
            id: id,
            start: true, // 请求开始的标记
            result: '-', // 状态码
            clientIp,
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

        this.cache[userId] = queue;
    }

    // 记录请求body
    async requestBody({ userId, id, body }) {
        // 将body写文件
        if (body) {
            let bodyPath = this.getRequestBodyPath(userId, id);
            await fileUtil.writeFile(bodyPath, body);
        }
    }

    // 记录响应
    async requestReturn({ userId, id, toClientResponse }) {
        let queue = this.cache[userId] || [];

        let expires = res.getHeader('expires');
        let body = toClientResponse.body;
        queue.push({
            id: id,
            result: res.statusCode,
            body: res.getHeader('content-length') || (body && body.length) || 0,
            caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + expires : ''),
            contentType: res.getHeader('content-type') || '',
            resHeaders: res._headers,
            resTime: +new Date()
        });

        this.cache[userId] = queue;
        if (body) {
            let bodyPath = this.getResponseBodyPath(userId, id);
            await fileUtil.writeFile(bodyPath, body);
        }
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

    // 获取请求记录path
    getRequestBodyPath(userId, requestId) {
        return path.join(this.trafficDir, userId + '_' + requestId + '_req_body');
    }

    // 获取响应记录path
    getResponseBodyPath(userId, requestId) {
        return path.join(this.trafficDir, userId + '_' + requestId + '_res_body');
    }
};