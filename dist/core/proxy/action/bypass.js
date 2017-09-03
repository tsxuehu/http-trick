"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _remote = require("../content/remote");

var _remote2 = _interopRequireDefault(_remote);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _repository = require("../../repository");

var _repository2 = _interopRequireDefault(_repository);

var _addHeaderToResponse = require("../../utils/addHeaderToResponse");

var _addHeaderToResponse2 = _interopRequireDefault(_addHeaderToResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let bypass;
class Bypass extends _action2.default {
    static getBypass() {
        if (!bypass) {
            bypass = new Bypass();
        }
        return bypass;
    }

    constructor() {
        super();
        this.hostRepository = _repository2.default.getHostRepository();
        this.remote = _remote2.default.getRemote();
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
            // 构造url
            let { protocol, hostname, path, port } = urlObj;

            let ipOrHost = _this.hostRepository.resolveHost(clientIp, hostname);
            let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

            toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

            let headers = _lodash2.default.assign({}, req.headers, extraRequestHeaders);

            if (last) {
                toClientResponse.sendedToClient = true;
                (0, _addHeaderToResponse2.default)(res, toClientResponse.headers);
                _this.remote.pipe({
                    req, res,
                    protocol, hostname, path, port, headers
                });
            } else {
                _this.remote.cache({
                    req, res,
                    targetUrl, headers, toClientResponse
                });
            }
        })();
    }
}
exports.default = Bypass;