import Action from './action'

export default class ModifyResponseBody extends Action{
    static getModifyResponseBody(){

    }

    /**
     * 运行处理动作
     */
    run({
            req,
            res,
            urlObj,
            rule, // 规则
            action, // 规则里的一个动作
            extraRequestHeaders, // 请求头
            toClientResponse, //响应内容
            last = true
        }) {

    }
}

var queryString = require('query-string');
exports.run = function (context) {
    var {res, urlObj, action, actionIndex, toSendResponse} = context;
    var body = toSendResponse.body;
    toSendResponse.headers[`fe-proxy-action-${actionIndex}`] = `modifyResponse ${action.data.modifyResponseBody}`;

    if (action.data.modifyResponseBody == 'addTimestampToJsCss') {

        toSendResponse.body = addTimestampToJsCss(body);

    } else if (action.data.modifyResponseBody == 'returnDataInJsonpStyle') {

        // jsonp请求 替换callback
        var parsed = queryString.parse(urlObj.search);
        var cbName = parsed[action.data.callbackName];
        toSendResponse.body = `${cbName}(${body})`;
        toSendResponse.headers['Content-Type'] = 'application/javascript;charset=utf-8';

    }

    return Promise.resolve(false);
};


exports.needResponse = true;

// =============  js css请求加时间戳
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
        return `${url.substring(0, url.length - 1)}${hasWenhao ? '&' : '?'}proxyts=${timestamp}${isDouble ? '"' : "'" }`;
    })
}
