const Action = require("./action");
const _ = require("lodash");
const ServiceRegistry = require("../../service");
const sendErrorToClient = require("../sendToClient/error");
const Local = require("../../utils/local");
const url = require("url");
const Remote = require("../../utils/remote");
const addHeaderToResponse = require("../../utils/addHeaderToResponse");
const cookie2Str = require("../../utils/cookie2Str");

/**
 * 重定向 本地 或者 远程
 */
let redirect;
module.exports = class Redirect extends Action {
    static getInstance() {
        if (!redirect) {
            redirect = new Redirect();
        }
        return redirect;
    }

    constructor() {
        super();
        this.hostRepository = ServiceRegistry.getHostService();
        this.profileService = ServiceRegistry.getProfileService();
        this.remote = Remote.getInstance();
        this.local = Local.getInstance();
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
        //================== 转发到本地 或远程
        let { href } = urlObj;
        // 解析目标
        let target = await this.profileService.calcPath(userId, href, rule.match, action.data.target);
        if (!target) {
            toClientResponse.sendedToClient = true;
            sendErrorToClient(req, res, 500, 'target parse error' + action.data.target);
            return;
        }
        // 远程
        if (target.startsWith('http')) {
            await this._toRemote({
                req,
                res,
                clientIp,
                target,
                requestHeaders,
                requestCookies,
                toClientResponse,
                last
            });
        } else {// 本地文件
            await this._toLocal({
                req,
                res,
                clientIp,
                target,
                rule,
                action,
                requestContent,
                requestHeaders,
                toClientResponse,
                last
            });
        }
    }

    async _toRemote({
                        req,
                        res,
                        clientIp,
                        userId,
                        target,
                        requestHeaders, // 请求头
                        requestCookies,
                        toClientResponse, //响应内容
                        last
                    }) {
        let redirectUrlObj = url.parse(target);
        let { protocol, hostname, path, port } = redirectUrlObj;

        let ipOrHost = await this.hostRepository.resolveHost(userId, hostname);

        port = port || ('https:' == protocol ? 443 : 80);

        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;
        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        requestHeaders.cookie = cookie2Str(requestCookies);

        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            this.remote.pipe({
                req, res,
                protocol, hostname, path, port, headers: requestHeaders
            });
        } else {
            this.remote.cache({
                req, res,
                targetUrl, headers: requestHeaders, toClientResponse
            });
        }
    }

    async _toLocal({
                       req,
                       res,
                       urlObj,
                       clientIp,
                       target,
                       rule, // 规则
                       action, // 规则里的一个动作
                       requestContent, // 请求内容
                       requestHeaders, // 请求头
                       toClientResponse, //响应内容
                       last
                   }) {

        toClientResponse.headers['fe-proxy-content'] = encodeURI(target);
        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            this.local.pipe({
                req,
                res,
                path: target
            });
        } else {
            await this.local.pipe({
                req,
                res,
                path: target,
                toClientResponse
            });
        }
    }
};