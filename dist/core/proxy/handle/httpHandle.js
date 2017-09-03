"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _parseUrl = require("../../utils/parseUrl");

var _parseUrl2 = _interopRequireDefault(_parseUrl);

var _repository = require("../../repository");

var _repository2 = _interopRequireDefault(_repository);

var _action = require("../action/action");

var _action2 = _interopRequireDefault(_action);

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

var _getClientIp = require("../../utils/getClientIp");

var _getClientIp2 = _interopRequireDefault(_getClientIp);

var _breakpoint = require("../breakpoint");

var _breakpoint2 = _interopRequireDefault(_breakpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// request session id seed
let idx = 0;
let httpHandle;
class HttpHandle {

    static getHttpHandle() {
        if (!httpHandle) {
            httpHandle = new HttpHandle();
        }
        return httpHandle;
    }

    constructor() {
        this.actionMap = _action2.default.getActionMap();
        this.breakpoint = _breakpoint2.default.getBreakpoint();

        this.ruleRepository = _repository2.default.getRuleRepository();
        this.configureRepository = _repository2.default.getConfigureRepository();
        this.runtimeRepository = _repository2.default.getRuntimeInfoRepository();
        this.breakpointRepository = _repository2.default.getBreakpointRepository();
        this.filterRepository = _repository2.default.getFilterRepository();
        this.logRepository = _repository2.default.getLogRepository();
        this.userRepository = _repository2.default.getUserRepository();
    }

    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    handle(req, res) {
        // 解析请求参数
        let urlObj = (0, _parseUrl2.default)(req);

        let clientIp = (0, _getClientIp2.default)(req);

        // 如果是 ui server请求，则直接转发不做记录
        if ((urlObj.hostname == '127.0.0.1' || urlObj.hostname == this.configureRepository.getPcIp()) && urlObj.port == this.configureRepository.getRealUiPort()) {
            this.actionMap['bypass'].run({ req, res, urlObj });
            return;
        }

        // 如果有客户端监听请求内容，则做记录
        if (this.runtimeRepository.hasHttpTraficMonitor()) {
            // 记录请求
            let id = ++idx;
            if (idx > 2000) idx = 0;
            this.logRepository.request({ clientIp, id, req, res, urlObj });

            // 日记记录body
            this._getRequestBody().then(body => {
                this.logRepository.reqBody({ clientIp, id, req, res, body });
            });

            this._getResponseToClient(res).then(responseContent => {
                this.logRepository.response({ clientIp, id, req, res, responseContent });
            });
        }

        // =========================================
        // 断点
        if (this.breakpointRepository.hasBreakpoint(clientIp, req.method, urlObj)) {
            this.breakpoint.run({
                req, res, urlObj, clientIp
            });
            return;
        }

        // =====================================================
        // 限流 https://github.com/tjgq/node-stream-throttle

        let matchedRule = this.ruleRepository.getProcessRule(clientIp, req.method, urlObj);

        this._runAtions({ req, res, urlObj, clientIp, rule: matchedRule });
    }

    /**
     * 运行动作
     * @returns {Promise.<void>}
     * @private
     */
    _runAtions({ req, res, urlObj, clientIp, rule }) {
        var _this = this;

        return _asyncToGenerator(function* () {
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
            let extraRequestHeaders = {};
            // 要发送给浏览器的内容
            let toClientResponse = {
                hasContent: false, // 是否存在要发送给浏览器的内容
                sendedToClient: false, // 已经向浏览器发送响应内容
                headers: {}, // 要发送给浏览器的header
                body: '' // 要发送给浏览器的body
            };

            // 转发规则处理
            if (!_this.configureRepository.getEnableRule(clientIp)) {
                // 判断转发规则有没有开启
                toClientResponse.headers['fe-proxy-rule-disabled'] = "true";
            }

            toClientResponse.headers['fe-proxy-uid'] = _this.userRepository.getClientIpMappedUserId(clientIp);

            // 查找过滤器
            let filterRuleList = _this.filterRepository.getFilterRuleList(clientIp, urlObj);

            // 获得要执行的action列表
            let willRunActionList = _this._mergeToRunAction(filterRuleList, rule);

            let willRunActionListLength = willRunActionList.length;
            // 执行前置动作
            for (let i = 0; i < willRunActionListLength; i++) {

                // 已经向浏览器发送响应，则停止规则处理
                if (toClientResponse.sendedToClient) {
                    break;
                }

                // 对每一个规则 执行action
                let actionInfo = willRunActionList[i];
                let action = actionInfo.action;
                let rule = actionInfo.rule;
                let actionHandler = _this.actionMap[action.type];

                if (!actionHandler) {
                    toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-notfound`);
                    continue;
                }
                // 已经有response, 则不运行获取response的action
                if (actionHandler.willGetContent() && toClientResponse.hasContent) {
                    toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-notrun`);
                    continue;
                }
                toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-run`);

                // 动作需要返回内容，但是当前却没有返回内容
                if (actionHandler.needResponse() && !toClientResponse.hasContent) {
                    yield _this.actionMap['bypass'].run({
                        req,
                        res,
                        urlObj,
                        clientIp,
                        rule, // 规则
                        action, // 规则里的一个动作
                        requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                        extraRequestHeaders, // 请求头
                        toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                        last: false
                    });
                }
                // 动作需要请求内容，但是当前却没有请求内容
                if (actionHandler.needRequestContent() && !requestContent.hasContent) {
                    requestContent = yield _this._getRequestContent(req, urlObj);
                }
                // 运行action
                yield actionHandler.run({
                    req,
                    res,
                    urlObj,
                    clientIp,
                    rule, // 规则
                    action, // 规则里的一个动作
                    requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                    extraRequestHeaders, // 请求头
                    toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                    last: i == willRunActionListLength - 1
                });
            }
        })();
    }

    // 同一个请求，返回同一个Promise
    _getRequestBody(req) {

        if (req.fetchDataPromise) {
            return req.fetchDataPromise;
        }

        let resolve = _.noop;
        let promise = new Promise(_ => {
            resolve = _;
        });

        if (req.method == 'POST' || req.method == 'PUT' || req.method == 'PATCH') {
            // 二进制文件 不记录 todo
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

    _getRequestContent(req, urlObj) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let body = yield _this2._getRequestBody(req);
            let { protocol, hostname, pathname, port } = urlObj;
            let query = _queryString2.default.parse(urlObj.search);
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
        })();
    }

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
                    _zlib2.default.gunzip(buffer, function (err, decoded) {
                        resolve(decoded && decoded.toString('binary'));
                    });
                } else if (encoding == 'deflate') {
                    _zlib2.default.inflate(buffer, function (err, decoded) {
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
                let actionHandler = this.actionMap[action.type];
                if (actionHandler.needResponse()) {
                    afterFilterActionsInfo.push({
                        action: action,
                        rule: rule
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
                rule: rule
            });
        });
        return beforeFilterActionsInfo.concat(ruleActionsInfo).concat(afterFilterActionsInfo);
    }
}
exports.default = HttpHandle;