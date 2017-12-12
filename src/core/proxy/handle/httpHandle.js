const zlib = require("zlib");
const parseUrl = require("../../utils/parseUrl");
const ServiceRegistry = require("../../service");
const Action = require("../action/index");
const queryString = require("query-string");
const getClientIp = require("../../utils/getClientIp");
const Breakpoint = require("../breakpoint");
const _ = require("lodash");
const cookie = require("cookie");
const sendSpecificToClient = require("../sendToClient/specific");

// request session id seed
let httpHandle;
module.exports = class HttpHandle {

    static getInstance() {
        if (!httpHandle) {
            httpHandle = new HttpHandle();
        }
        return httpHandle;
    }

    constructor() {
        this.breakpoint = Breakpoint.getBreakpoint();
        this.ruleService = ServiceRegistry.getRuleService();
        this.profileService = ServiceRegistry.getProfileService();
        this.appInfoService = ServiceRegistry.getAppInfoService();
        this.breakpointService = ServiceRegistry.getBreakpointService();
        this.filterService = ServiceRegistry.getFilterService();
        this.httpTrafficService = ServiceRegistry.getHttpTrafficService();
    }

    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    async handle(req, res) {
        // 解析请求参数
        let urlObj = parseUrl(req);

        let clientIp = getClientIp(req);
        let userId = this.profileService.getClientIpMappedUserId(clientIp);

        // 如果是 ui server请求，则直接转发不做记录
        if ((urlObj.hostname == '127.0.0.1' || urlObj.hostname == this.appInfoService.getPcIp())
            && urlObj.port == this.appInfoService.getRealUiPort()) {
            Action.getBypassAction().run({
                req, res, urlObj, toClientResponse: {
                    headers: {}
                },
                requestContent: {},
                additionalRequestHeaders: {},
                actualRequestHeaders: {},
                actualRequestCookies: {}
            });
            return;
        }

        // 如果有客户端监听请求内容，则做记录
        if (this.httpTrafficService.hasMonitor(userId)) {
            // 记录请求
            let id = this.httpTrafficService.getRequestId(userId);
            if (id > -1) {
                this.httpTrafficService.requestBegin({ userId, clientIp, id, req, res, urlObj });

                // 日记记录body
                this._getRequestBody().then(body => {
                    this.httpTrafficService.requestBody({ userId, id, req, res, body });
                });

                this._getResponseToClient(res).then(responseContent => {
                    this.httpTrafficService.requestReturn({ userId, id, req, res, responseContent });
                });
            }
        }

        // =========================================
        // 断点
        let breakpointId = await this.breakpoint
            .getBreakpointId(userId, req.method, urlObj);
        if (breakpointId > 0) {
            let requestContent = await this._getRequestContent(
                req,
                urlObj);
            this.breakpoint.run({
                req, res, urlObj, userId, breakpointId, requestContent
            });
            return;
        }

        // =====================================================
        // 限流 https://github.com/tjgq/node-stream-throttle

        let matchedRule = this.ruleService.getProcessRuleList(userId, req.method, urlObj);

        let result = await this._runAtions({ req, res, urlObj, clientIp, userId, rule: matchedRule });
        // 处理结束 记录额外的请求日志(附加的请求头、cookie、body)
    }

    /**
     * 运行规则
     * @param req
     * @param res
     * @param urlObj
     * @param clientIp
     * @param rule 请求匹配到的规则
     * @returns {Promise.<void>}
     * @private
     */
    async _runAtions({ req, res, urlObj, rule, clientIp, userId }) {
        // 原始的请求头部
        let requestContent = {
            hasContent: false,
            protocol: '',
            hostname: '',
            path: '',
            port: '',
            headers: {},
            body: ''
        };
        // 额外发送的头部
        let additionalRequestHeaders = {};
        let actualRequestHeaders = {};
        // 额外发送的cookie
        let additionalRequestCookies = {};
        let actualRequestCookies = {};

        // 要发送给浏览器的内容
        let toClientResponse = {
            hasContent: false,// 是否存在要发送给浏览器的内容
            sendedToClient: false, // 已经向浏览器发送响应内容
            headers: {},// 要发送给浏览器的header
            body: ''// 要发送给浏览器的body
        };

        // 转发规则处理
        if (!this.profileService.enableRule(userId)) {// 判断转发规则有没有开启
            toClientResponse.headers['fe-proxy-rule-disabled'] = "true";
        }
        // 记录请求对应的用户id
        toClientResponse.headers['fe-proxy-userId'] = userId;

        // 查找匹配到的过滤规则
        let filterRuleList = await this.filterService.getMatchedRuleList(userId, req.method, urlObj);

        // 合并所有匹配到的过滤器规则的action列表、请求匹配的规则的 action 列表
        // 动作分为请求前和请求后两种类型, 合并后的顺序，前置过滤器动作 -> 请求匹配到的动作 -> 后置过滤器的动作
        // 合并后的数组 item 格式 {action, rule}， action: 要执行的动作，rule: 动作所属的rule
        let willRunActionList = this._mergeToRunAction(filterRuleList, rule);
        let willRunActionListLength = willRunActionList.length;

        // 执行前置动作
        for (let i = 0; i < willRunActionListLength; i++) {

            // 已经向浏览器发送响应，则停止规则处理
            if (toClientResponse.sendedToClient) {
                break;
            }
            // 取出将要运行的动作描述信息
            let actionInfo = willRunActionList[i];
            // 对每一个规则 执行action
            let action = actionInfo.action;
            let rule = actionInfo.rule;
            let actionHandler = Action.getAction(action.type);

            // 若action handle不存在，则处理下一个
            if (!actionHandler) {
                toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-notfound`);
                continue;
            }
            // 已经有response, 则不运行获取response的action
            if (actionHandler.willGetContent() && toClientResponse.hasContent) {
                toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-notrun`);
                continue;
            }
            // 响应头里面记录运行的动作
            toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-run`);

            // 动作需要返回内容，但是当前却没有返回内容
            if (actionHandler.needResponse() && !toClientResponse.hasContent) {
                await Action.getBypassAction().run({
                    req,
                    res,
                    urlObj,
                    clientIp,
                    userId,
                    rule, // 规则
                    action, // 规则里的一个动作
                    requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                    additionalRequestHeaders, // 请求头
                    additionalRequestCookies, // cookie
                    toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                    last: false
                });
            }
            // 动作需要请求内容，但是当前却没有请求内容
            if (actionHandler.needRequestContent() && !requestContent.hasContent) {
                requestContent = await this._getRequestContent(
                    req,
                    urlObj);
            }
            // 运行action
            await actionHandler.run({
                req,
                res,
                urlObj,
                clientIp,
                userId,
                rule, // 规则
                action, // 规则里的一个动作
                requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                additionalRequestHeaders, // 请求头
                actualRequestHeaders,
                additionalRequestCookies, // cookie
                actualRequestCookies,
                toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                last: i == (willRunActionListLength - 1)
            });
        }

        // 动作运行完还没响应浏览器、则响应浏览器
        if (!toClientResponse.sendedToClient) {
            if (toClientResponse.hasContent) {
                sendSpecificToClient({
                    res, statusCode: 200, headers: toClientResponse.headers, content: toClientResponse.body
                });

            } else {
                // 自定请求
                toClientResponse.headers['fe-proxy-rule-add'] = 'bypass';
                await Action.getBypassAction().run({
                    req,
                    res,
                    urlObj,
                    clientIp,
                    userId,
                    requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                    additionalRequestHeaders, // 请求头
                    actualRequestHeaders,
                    additionalRequestCookies, // cookie
                    actualRequestCookies,
                    toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                    last: true
                });
            }

        }

        return {
            additionalRequestHeaders,
            additionalRequestCookies,
            toClientResponse
        };
    }

    // 获取请求body
    // 同一个请求，返回同一个Promise
    _getRequestBody(req) {

        if (req.fetchDataPromise) {
            return req.fetchDataPromise;
        }

        let resolve = _.noop;
        let promise = new Promise(_ => {
            resolve = _;
        });
        // 对带body请求 获取body， 其他method返回空字符串
        let type = this._getContentType(req);
        let method = req.method.lowerCase();
        if (type
            && ['application/json', 'application/x-www-form-urlencoded', 'text/plain', 'text/html'].indexOf(type) > -1
            && ['post', 'put', 'patch'].indexOf(method) > -1) {
            let body = '';
            // 图片类型的body需要进行特殊处理
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                resolve(body);
            });
        } else {
            resolve("");
        }
        req.fetchDataPromise = promise;
        return req.fetchDataPromise;
    }

    // 获取请求的content type
    _getContentType(request) {
        let headers = request.headers;
        let contentType = headers['content-type'];
        if (!contentType) {
            return;
        }
        if (Array.isArray(contentType)) {
            contentType = contentType[0];
        }
        const index = contentType.indexOf(';');
        return index > -1 ? contentType.substr(0, index) : contentType;
    }

    // 获取请求内容
    // 从_getRequestBody返回的 body 组装请求内容
    async _getRequestContent(req, urlObj) {
        let body = await this._getRequestBody(req);
        let { protocol, hostname, href, pathname, port } = urlObj;
        let query = queryString.parse(urlObj.search);
        return {
            hasContent: true,
            protocol, // 请求协议
            hostname, // 请求域名
            method: req.method, // 请求方法
            pathname, // 路径
            query, // query对象
            port, // 端口号
            headers: _.assign({}, req.headers), // 请求头
            body // 请求body
        };
    }

    // 获取返回给client的内容
    // 原理：两个流pipe时有pipe事件，监听输入流上的数据
    _getResponseToClient(res) {
        if (res.responseToClientPromise) {
            return req.responseToClientPromise;
        }

        let resolve = _.noop;
        let promise = new Promise(_ => {
            resolve = _;
        });

        // 对服务器端的响应流做记录
        res.on('pipe', function (readStream) {
            var chunks = [];
            readStream.on('data', function (chunk) {
                chunks.push(chunk);
                //  res.write(chunk);
            });
            readStream.on('end', function () {
                var headers = readStream.headers || [];
                var buffer = Buffer.concat(chunks);
                var encoding = headers['content-encoding'];
                // handler gzip & defalte transport
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function (err, decoded) {
                        resolve(decoded && decoded.toString('binary'));
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function (err, decoded) {
                        resolve(decoded && decoded.toString('binary'));
                    });
                } else {
                    resolve(buffer.toString('binary'));
                }
            });
        });

        res.responseToClientPromise = promise;
        return res.responseToClientPromise;
    }

    /**
     * 合并过滤规则，和请求处理规则
     *  生成要执行的action列表
     * @param filterRules
     * @param processRule
     * @private
     */
    _mergeToRunAction(filterRules, processRule) {
        let beforeFilterActionsInfo = [];
        let afterFilterActionsInfo = [];

        _.forEach(filterRules, rule => {
            _.forEach(rule.actionList, action => {
                let actionHandler = Action.getAction(action.type);
                if (actionHandler.needResponse()) {
                    afterFilterActionsInfo.push({
                        action: action, // 动作
                        rule: rule // 动作关联的规则
                    });
                } else {
                    beforeFilterActionsInfo.push({
                        action: action,
                        rule: rule
                    });
                }
            });
        });

        let ruleActionsInfo = [];
        _.forEach(processRule.actionList, action => {
            ruleActionsInfo.push({
                action: action,
                rule: processRule
            });
        });
        return beforeFilterActionsInfo.concat(ruleActionsInfo).concat(afterFilterActionsInfo);
    }
};