"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _cookie = require("cookie");

var _cookie2 = _interopRequireDefault(_cookie);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let addRequestCookie;
class AddRequestCookie extends _action2.default {
    static getAddRequestCookie() {
        if (!addRequestCookie) {
            addRequestCookie = new AddRequestCookie();
        }
        return addRequestCookie;
    }

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
        return _asyncToGenerator(function* () {
            let cookies = _cookie2.default.parse(req.headers.cookie);
            let tobeSet = _cookie2.default.parse(action.data.cookie);

            _lodash2.default.forEach(tobeSet, function (value, key) {
                cookies[key] = value;
            });

            let arr = [];

            _lodash2.default.forEach(cookies, function (value, key) {
                arr.push(`${key}=${value}`);
            });

            extraRequestHeaders.Cookie = arr.join(";");
        })();
    }
}
exports.default = AddRequestCookie;