"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _addRequestCookie = require("./addRequestCookie");

var _addRequestCookie2 = _interopRequireDefault(_addRequestCookie);

var _addRequestHeader = require("./addRequestHeader");

var _addRequestHeader2 = _interopRequireDefault(_addRequestHeader);

var _bypass = require("./bypass");

var _bypass2 = _interopRequireDefault(_bypass);

var _dataMock = require("./dataMock");

var _dataMock2 = _interopRequireDefault(_dataMock);

var _modifyResponse = require("./modifyResponse");

var _modifyResponse2 = _interopRequireDefault(_modifyResponse);

var _redirect = require("./redirect");

var _redirect2 = _interopRequireDefault(_redirect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 按照处理实际分为三种类型的处理器
 * 1）修改请求
 * 2）获取响应内容
 * 3）修改响应内容
 */
let actionMap;
class Action {
    /**
     * 获取所有的action名和 action 映射关系 map
     */
    static getActionMap() {
        if (!actionMap) {
            actionMap = {
                mockData: _dataMock2.default.getMockData(),
                addRequestCookie: _addRequestCookie2.default.getAddRequestCookie(),
                addRequestHeader: _addRequestHeader2.default.getAddRequestHeader(),
                modifyResponse: _modifyResponse2.default.getModifyResponse(),
                bypass: _bypass2.default.getBypass(),
                redirect: _redirect2.default.getRedirect()
            };
        }
        return actionMap;
    }

    /**
     * 动作运行是否需要浏览器的请求内容
     */
    needRequestContent() {
        return false;
    }

    /**
     * 动作运行是否需要服务器端的返回内容
     */
    needResponse() {
        return false;
    }

    /**
     * 执行此动作是否获取内容
     * 指示性flag，减少不必要的action执行
     * @returns {boolean}
     */
    willGetContent() {
        return false;
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
        requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
        extraRequestHeaders, // 请求头
        toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
        last = true
    }) {
        return _asyncToGenerator(function* () {})();
    }
}
exports.default = Action;