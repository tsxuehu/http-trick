const Action = require("./action");
const Remote = require("../../../utils/remote");
const _ = require("lodash");
const ServiceRegistry = require("../../../service");
const addHeaderToResponse = require("../../../utils/addHeaderToResponse");
const cookie2Str = require("../../../utils/cookie2Str");
const sendSpecificToClient = require("../../../utils/sendSpecificToClient");
const cookie = require("cookie");
const toClientResponseUtils = require("../../../utils/toClientResponseUtils");
const queryString = require("query-string");

let bypass;
module.exports = class Bypass extends Action {
    static getInstance() {
        if (!bypass) {
            bypass = new Bypass();
        }
        return bypass;
    }

    constructor() {
        super();
        this.hostService = ServiceRegistry.getHostService();
        this.profileService = ServiceRegistry.getProfileService();
        this.remote = Remote.getInstance();
    }

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return true;
    }

    /**
     * 运行处理动作
     */
    async run({
                  req,
                  res,
                  recordResponse,
                  urlObj,
                  clientIp,
                  deviceId,
                  userId,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 请求内容
                  additionalRequestHeaders, // 请求头
                  actualRequestHeaders,
                  additionalRequestQuery, // query
                  actualRequestQuery,
                  additionalRequestCookies, // cookie
                  actualRequestCookies,
                  toClientResponse, //响应内容
                  last = true
              }) {
        // 查找当前用户是否有流量监控窗
        // 若有监控窗，则将返回浏览器的内容放入 toClientResponse

        if (requestContent.hasContent) {
            await this.bypassWithRequestContent({
                req,
                res,
                recordResponse,
                urlObj,
                clientIp,
                deviceId,
                userId,
                rule, // 规则
                action, // 规则里的一个动作
                requestContent, // 请求内容
                additionalRequestHeaders, // 请求头
                actualRequestHeaders,
                additionalRequestQuery, // query
                actualRequestQuery,
                additionalRequestCookies, // cookie
                actualRequestCookies,
                toClientResponse, //响应内容
                last
            });
        } else {
            await this.bypass({
                req,
                res,
                recordResponse,
                urlObj,
                clientIp,
                deviceId,
                userId,
                rule, // 规则
                action, // 规则里的一个动作
                requestContent, // 请求内容
                additionalRequestHeaders, // 请求头
                actualRequestHeaders,
                additionalRequestQuery, // query
                actualRequestQuery,
                additionalRequestCookies, // cookie
                actualRequestCookies,
                toClientResponse, //响应内容
                last
            });
        }
    }

    async bypass({
                     req,
                     res,
                     recordResponse,
                     urlObj,
                     clientIp,
                     deviceId,
                     userId,
                     rule, // 规则
                     action, // 规则里的一个动作
                     requestContent, // 请求内容
                     additionalRequestHeaders, // 请求头
                     actualRequestHeaders,
                     additionalRequestQuery, // query
                     actualRequestQuery,
                     additionalRequestCookies, // cookie
                     actualRequestCookies,
                     toClientResponse, //响应内容
                     last = true
                 }) {
        // 构造url
        let {protocol, hostname, path, pathname, port, query} = urlObj;

        // 构造path
        try {
            let originQuery = queryString.parse(query);
            Object.assign(actualRequestQuery, originQuery);
            if (Object.keys(additionalRequestQuery).length > 0) {
                Object.assign(actualRequestQuery, additionalRequestQuery);
                path = `${pathname}?${queryString.stringify(actualRequestQuery)}`;
            }
        } catch (e) {
        }


        // dns解析
        toClientResponse.dnsResolveBeginTime = Date.now();
        let ip = '';
        let resolveWay = '';
        try {
            let result = await this.hostService.resolveHostWithWay(userId, deviceId, hostname);
            resolveWay = result.way;
            ip = result.ip;
        } catch (e) {
            let href = `${protocol}//${hostname}:${port}${path}`;
            toClientResponseUtils.setError(toClientResponse, href, e);
            return;
        }
        toClientResponse.headers['proxy-remote-ip'] = ip;
        toClientResponse.headers['proxy-resolve-way'] = resolveWay;
        toClientResponse.remoteIp = ip;

        // 日志
        let targetUrl = protocol + '//' + hostname + ':' + port + path;
        toClientResponse.headers['proxy-content'] = encodeURI(targetUrl);

        // 合并header
        Object.assign(actualRequestHeaders, req.headers, additionalRequestHeaders);

        let originCookies = cookie.parse(req.headers.cookie || "");
        Object.assign(actualRequestCookies, originCookies, additionalRequestCookies);
        actualRequestHeaders.cookie = cookie2Str(actualRequestCookies);

        // 判断是否需要proxy
        let hasExternalProxy = this.profileService.hasExternalProxy(userId);
        let proxyIp = '';
        let proxyPort = '';
        let proxyType = '';
        if (hasExternalProxy) {
            let proxyConfig = this.profileService.getExternalHttpProxy(userId);
            if (!proxyConfig) {
                hasExternalProxy = false;
            } else {
                proxyType = proxyConfig.proxyType;
                proxyIp = proxyConfig.proxyIp;
                proxyPort = proxyConfig.proxyPort;
            }
            // 运行信息可以在下一个proxy中查看
            Object.assign(actualRequestHeaders, toClientResponse.headers);
        }

        if (!last) {
            await this.remote.cache({
                req,
                res,
                recordResponse,
                method: req.method,
                protocol,
                hostname,
                ip,
                path,
                port,
                headers: actualRequestHeaders,
                toClientResponse,
                hasExternalProxy,proxyType, proxyIp, proxyPort
            });
        } else {
            await this.remote.pipe({
                req,
                res,
                protocol,
                path,
                port,
                toClientResponse,
                recordResponse,
                method: req.method,
                hostname,
                ip,
                headers: actualRequestHeaders,
                hasExternalProxy,proxyType, proxyIp, proxyPort
            });
        }

    }

    async bypassWithRequestContent({
                                       req,
                                       res,
                                       recordResponse,
                                       urlObj,
                                       clientIp,
                                       deviceId,
                                       userId,
                                       rule, // 规则
                                       action, // 规则里的一个动作
                                       requestContent, // 请求内容
                                       additionalRequestHeaders, // 请求头
                                       actualRequestHeaders,
                                       additionalRequestQuery, // query
                                       actualRequestQuery,
                                       additionalRequestCookies, // cookie
                                       actualRequestCookies,
                                       toClientResponse, //响应内容
                                       last = true
                                   }) {
        // 构造url
        let {protocol, hostname, pathname, port, query, method, headers, body} = requestContent;

        Object.assign(actualRequestQuery, query, additionalRequestQuery);

        // dns解析
        toClientResponse.dnsResolveBeginTime = Date.now();
        let ip = '';
        let resolveWay = '';
        try {
            let result = await this.hostService.resolveHostWithWay(userId, deviceId, hostname);
            resolveWay = result.way;
            ip = result.ip;
        } catch (e) {
            let href = `${protocol}//${hostname}:${port}${pathname}?${queryString.stringify(actualRequestQuery)}`;
            toClientResponseUtils.setError(toClientResponse, href, e);
            return;
        }
        toClientResponse.headers['proxy-remote-ip'] = ip;
        toClientResponse.headers['proxy-resolve-way'] = resolveWay;
        toClientResponse.remoteIp = ip;

        // 日志记录请求地址
        let targetUrl = protocol + '//' + ip + ':' + port + pathname;
        toClientResponse.headers['proxy-content'] = encodeURI(targetUrl);

        // 合并header
        Object.assign(actualRequestHeaders, headers, additionalRequestHeaders);
        let originCookies = cookie.parse(headers.cookie || "");
        Object.assign(actualRequestCookies, originCookies, additionalRequestCookies);
        actualRequestHeaders.cookie = cookie2Str(actualRequestCookies);

        // 判断是否需要proxy
        let hasExternalProxy = this.profileService.hasExternalProxy(userId);
        let proxyIp = '';
        let proxyPort = '';
        let proxyType = '';
        if (hasExternalProxy) {
            let proxyConfig = this.profileService.getExternalHttpProxy(userId);
            if (!proxyConfig) {
                hasExternalProxy = false;
            } else {
                proxyType = proxyConfig.proxyType;
                proxyIp = proxyConfig.proxyIp;
                proxyPort = proxyConfig.proxyPort;
            }
            // 运行信息可以在下一个proxy中查看
            Object.assign(actualRequestHeaders, toClientResponse.headers);
        }

        await this.remote.cacheFromRequestContent({
            requestContent: {
                protocol,
                method,
                hostname,
                ip,
                pathname,
                actualRequestQuery,
                port,
                headers: actualRequestHeaders,
                body,
                hasExternalProxy,proxyType, proxyIp, proxyPort
            },
            recordResponse,
            toClientResponse
        });

        if (last) {
            toClientResponse.sendedToClient = true;
            await sendSpecificToClient({
                res,
                statusCode: toClientResponse.statusCode,
                headers: toClientResponse.headers,
                content: toClientResponse.body
            });
        }
    }
};
