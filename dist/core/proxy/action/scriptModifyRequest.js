"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 自定义js脚本修改请求内容
 */
class ScriptModifyRequest extends _action2.default {

    needRequestContent() {
        return true;
    }

    willGetContent() {
        return true;
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

        // 运行用户脚本, 修改请求内容

        // 发送请求，获取内容  或者将远端内容直接返回给浏览器

        return _asyncToGenerator(function* () {})();
    }
}
exports.default = ScriptModifyRequest;