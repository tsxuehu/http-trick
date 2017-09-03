"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _repository = require("../../repository");

var _repository2 = _interopRequireDefault(_repository);

var _error = require("../sendToClient/error");

var _error2 = _interopRequireDefault(_error);

var _local = require("../content/local");

var _local2 = _interopRequireDefault(_local);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _remote = require("../content/remote");

var _remote2 = _interopRequireDefault(_remote);

var _addHeaderToResponse = require("../../utils/addHeaderToResponse");

var _addHeaderToResponse2 = _interopRequireDefault(_addHeaderToResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 重定向 本地 或者 远程
 */
class Redirect extends _action2.default {
    static getRedirect() {}

    constructor() {
        super();
        this.hostRepository = _repository2.default.getHostRepository();
        this.configureRepository = _repository2.default.getConfigureRepository();
        this.remote = _remote2.default.getRemote();
        this.local = _local2.default.getLocal();
    }

    willGetContent() {
        return true;
    }

    /**
     * 运行处理动作
     */
    run({
        req,
        res,
        urlObj,
        clientIp,
        rule, // 规则
        action, // 规则里的一个动作
        requestContent, // 请求内容
        extraRequestHeaders, // 请求头
        toClientResponse, //响应内容
        last = true
    }) {
        var _this = this;

        return _asyncToGenerator(function* () {
            //================== 转发到本地 或远程
            let { href } = urlObj;
            // 解析目标
            let target = _this.configureRepository.calcPath(clientIp, href, rule.match, action.data.target);
            if (!target) {
                toClientResponse.sendedToClient = true;
                (0, _error2.default)(req, res, 500, 'target parse error' + action.data.target);
                return;
            }
            // 远程
            if (target.startsWith('http')) {
                yield _this._toRemote({
                    req,
                    res,
                    clientIp,
                    target,
                    extraRequestHeaders,
                    toClientResponse,
                    last
                });
            } else {
                // 本地文件
                yield _this._toLocal({
                    req,
                    res,
                    clientIp,
                    target,
                    rule,
                    action,
                    requestContent,
                    extraRequestHeaders,
                    toClientResponse,
                    last
                });
            }
        })();
    }

    _toRemote({
        req,
        res,
        clientIp,
        target,
        extraRequestHeaders, // 请求头
        toClientResponse, //响应内容
        last
    }) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let redirectUrlObj = _url2.default.parse(target);
            let { protocol, hostname, path, port } = redirectUrlObj;

            let ipOrHost = _this2.hostRepository.resolveHost(clientIp, hostname);

            port = port || ('https:' == protocol ? 443 : 80);

            let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;
            toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);
            let headers = _lodash2.default.assign({}, req.headers, extraRequestHeaders);
            if (last) {
                toClientResponse.sendedToClient = true;
                (0, _addHeaderToResponse2.default)(res, toClientResponse.headers);
                _this2.remote.pipe({
                    req, res,
                    protocol, hostname, path, port, headers
                });
            } else {
                _this2.remote.cache({
                    req, res,
                    targetUrl, headers, toClientResponse
                });
            }
        })();
    }

    _toLocal({
        req,
        res,
        urlObj,
        clientIp,
        target,
        rule, // 规则
        action, // 规则里的一个动作
        requestContent, // 请求内容
        extraRequestHeaders, // 请求头
        toClientResponse, //响应内容
        last
    }) {
        var _this3 = this;

        return _asyncToGenerator(function* () {

            toClientResponse.headers['fe-proxy-content'] = encodeURI(target);
            if (last) {
                toClientResponse.sendedToClient = true;
                (0, _addHeaderToResponse2.default)(res, toClientResponse.headers);
                _this3.local.pipe({
                    req,
                    res,
                    path: target
                });
            } else {
                yield _this3.local.pipe({
                    req,
                    res,
                    path: target,
                    toClientResponse
                });
            }
        })();
    }
}
exports.default = Redirect;