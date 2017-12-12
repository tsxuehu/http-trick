const Action = require("./action");
const Remote = require("../../utils/remote");
const _ = require("lodash");
const ServiceRegistry = require("../../service");
const addHeaderToResponse = require("../../utils/addHeaderToResponse");
const cookie2Str = require("../../utils/cookie2Str");
const sendSpecificToClient = require("../sendToClient/specific");

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
                  requestHeaders, // 请求头
                  requestCookies,
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
                requestHeaders, // 请求头
                requestCookies,
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
                requestHeaders, // 请求头
                requestCookies,
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
                     requestHeaders, // 请求头
                     requestCookies,
                     toClientResponse, //响应内容
                     last = true
                 }) {
        // 构造url
        let { protocol, hostname, path, port } = urlObj;

        let ipOrHost = await this.hostRepository.resolveHost(userId, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        requestHeaders.cookie = cookie2Str(requestCookies);

        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            await this.remote.pipe({
                req, res,
                protocol, hostname, path, port, headers: requestHeaders
            });
        } else {
            await this.remote.cache({
                req, res,
                targetUrl, headers: requestHeaders, toClientResponse
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
                                       requestHeaders, // 请求头
                                       requestCookies,
                                       toClientResponse, //响应内容
                                       last = true
                                   }) {
        // 构造url
        let { protocol, hostname, path, port, method, body } = requestContent;

        let ipOrHost = await this.hostRepository.resolveHost(userId, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        requestHeaders.cookie = cookie2Str(requestCookies);

        await this.remote.cacheFromRequestContent({
            requestContent: {
                protocol,
                method,
                hostname: ipOrHost,
                path,
                port,
                headers: requestHeaders,
                body
            },
            toClientResponse
        });

        if (last) {
            toClientResponse.sendedToClient = true;
            sendSpecificToClient({
                res, statusCode: 200, headers: toClientResponse.headers, content: toClientResponse.body
            });
        }
    }
};