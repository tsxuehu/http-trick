const Action = require("./action");
const Remote = require("../../utils/remote");
const _ = require("lodash");
const ServiceRegistry = require("../../service");
const addHeaderToResponse = require("../../utils/addHeaderToResponse");
const cookie2Str = require("../../utils/cookie2Str");
const sendSpecificToClient = require("../sendToClient/specific");
const cookie = require("cookie");

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
        this.hostRepository = ServiceRegistry.getHostService();
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
                  urlObj,
                  clientIp,
                  userId,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 请求内容
                  additionalRequestHeaders, // 请求头
                  actualRequestHeaders,
                  additionalRequestCookies, // cookie
                  actualRequestCookies,
                  toClientResponse, //响应内容
                  last = true
              }) {
        if (requestContent.hasContent) {
            await this.bypassWithRequestContent({
                req,
                res,
                urlObj,
                clientIp,
                userId,
                rule, // 规则
                action, // 规则里的一个动作
                requestContent, // 请求内容
                additionalRequestHeaders, // 请求头
                actualRequestHeaders,
                additionalRequestCookies, // cookie
                actualRequestCookies,
                toClientResponse, //响应内容
                last
            });
        } else {
            await this.bypass({
                req,
                res,
                urlObj,
                clientIp,
                userId,
                rule, // 规则
                action, // 规则里的一个动作
                requestContent, // 请求内容
                additionalRequestHeaders, // 请求头
                actualRequestHeaders,
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
                     urlObj,
                     clientIp,
                     userId,
                     rule, // 规则
                     action, // 规则里的一个动作
                     requestContent, // 请求内容
                     additionalRequestHeaders, // 请求头
                     actualRequestHeaders,
                     additionalRequestCookies, // cookie
                     actualRequestCookies,
                     toClientResponse, //响应内容
                     last = true
                 }) {
        // 构造url
        let { protocol, hostname, path, port } = urlObj;

        let ipOrHost = await this.hostRepository.resolveHost(userId, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        // 合并header
        Object.assign(actualRequestHeaders, req.headers, additionalRequestHeaders);
        let originCookies = cookie.parse(req.headers.cookie || "");
        Object.assign(actualRequestCookies, originCookies, additionalRequestCookies);
        actualRequestHeaders.cookie = cookie2Str(actualRequestCookies);

        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            await this.remote.pipe({
                req, res,
                protocol, hostname, path, port, headers: actualRequestHeaders
            });
        } else {
            await this.remote.cache({
                req, res,
                targetUrl, headers: actualRequestHeaders, toClientResponse
            });
        }

    }

    async bypassWithRequestContent({
                                       req,
                                       res,
                                       urlObj,
                                       clientIp,
                                       userId,
                                       rule, // 规则
                                       action, // 规则里的一个动作
                                       requestContent, // 请求内容
                                       additionalRequestHeaders, // 请求头
                                       actualRequestHeaders,
                                       additionalRequestCookies, // cookie
                                       actualRequestCookies,
                                       toClientResponse, //响应内容
                                       last = true
                                   }) {
        // 构造url
        let { protocol, hostname, path, port, query, method, headers, body } = requestContent;

        let ipOrHost = await this.hostRepository.resolveHost(userId, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        // 合并header
        Object.assign(actualRequestHeaders, headers, additionalRequestHeaders);
        let originCookies = cookie.parse(headers.cookie || "");
        Object.assign(actualRequestCookies, originCookies, additionalRequestCookies);
        actualRequestHeaders.cookie = cookie2Str(actualRequestCookies);

        await this.remote.cacheFromRequestContent({
            requestContent: {
                protocol,
                method,
                hostname: ipOrHost,
                path,
                query,
                port,
                headers: actualRequestHeaders,
                body
            },
            toClientResponse
        });

        if (last) {
            toClientResponse.sendedToClient = true;
            sendSpecificToClient({
                res,
                statusCode: toClientResponse.code,
                headers: toClientResponse.headers,
                content: toClientResponse.body
            });
        }
    }
};