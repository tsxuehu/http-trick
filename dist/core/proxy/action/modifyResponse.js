"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

var _error = require("../sendToClient/error");

var _error2 = _interopRequireDefault(_error);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ModifyResponse extends _action2.default {
    static getModifyResponse() {}

    needResponse() {
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
        return _asyncToGenerator(function* () {

            if (action.data.modifyResponseType == 'addTimestampToJsCss') {

                toClientResponse.body = addTimestampToJsCss(body);
            } else if (action.data.modifyResponseType == "returnDataInJsonpStyle") {

                // jsonp请求 替换callback
                let parsed = _queryString2.default.parse(urlObj.search);
                let cbName = parsed[action.data.callbackName];
                toClientResponse.body = `${cbName}(${body})`;
                toClientResponse.headers['Content-Type'] = 'application/javascript;charset=utf-8';
            } else if (action.data.modifyResponseType == "allowCros") {
                // todo 存在问题
                // req.headers.origin || ''
                toClientResponse.headers['Access-Control-Allow-Origin'] = '*';
                // toClientResponse.headers['Vary'] =  'Origin';
                toClientResponse.headers['Access-Control-Allow-Credentials'] = true;
                toClientResponse.headers['Access-Control-Allow-Methods'] = req.headers['Access-Control-Request-Method'] || '';
                toClientResponse.headers['Access-Control-Allow-Headers'] = req.headers['Access-Control-Request-Headers'] || '';
                let method = req.method;
                if (_lodash2.default.lowerCase(method) == 'option') {
                    toClientResponse.headers['Access-Control-Max-Age'] = 86400;
                }
            } else if (action.data.modifyResponseType == "return404") {

                toClientResponse.sendedToClient = true;
                (0, _error2.default)(req, res, 404, 'user want');
            }
        })();
    }
}

exports.default = ModifyResponse; // =============  js css请求加时间戳

var hrefReg = /href=['"].*?['"]/gi;
var srcReg = /src=['"].*?['"]/gi;
function addTimestampToJsCss(body) {
    //<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic">
    //<script async="async" crossorigin="anonymous"  src="https://assets-cdn.github.com/assets/60.js">
    var timestamp = new Date().getTime();
    body = body.replace(/<script .*?>|<link .*?>/gi, element => {
        // 对script src属性进行处理
        var isLink = element.startsWith('<link');
        var toReplace = addTimestampToElement(element, isLink ? hrefReg : srcReg, timestamp);
        return toReplace;
    });
    return body;
}

function addTimestampToElement(element, reg, timestamp) {
    return element.replace(reg, url => {
        var isDouble = url.indexOf('"') > -1;
        var hasWenhao = url.indexOf('?') > -1;
        return `${url.substring(0, url.length - 1)}${hasWenhao ? '&' : '?'}proxyts=${timestamp}${isDouble ? '"' : "'"}`;
    });
}