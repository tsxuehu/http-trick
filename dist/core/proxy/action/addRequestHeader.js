"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let addRequestHeader;
/**
 * 增加请求头
 */
class AddRequestHeader extends _action2.default {
    static getAddRequestHeader() {
        if (!addRequestHeader) {
            addRequestHeader = new AddRequestHeader();
        }
        return addRequestHeader;
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
        return _asyncToGenerator(function* () {
            _lodash2.default.assign(extraRequestHeaders, action.data.headers);
        })();
    }
}
exports.default = AddRequestHeader;