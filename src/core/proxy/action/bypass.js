import Action from './action'

export default class Bypass extends Action{
    static getBypass(){

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
            requestHeaders, // 请求头
            toSendResponse //响应内容
        }) {

    }
}




var remoteResCache = require('../response/remote-cache');
var remoteResPipe = require('../response/remote-pipe');
var _ = require('lodash');
/**
 * 为proxy注册事件处理函数
 */
exports.run = function ({
                            req, res, urlObj,
                            action, actionIndex,
                            hasNextAction,
                            requestHeaders,
                            toSendResponse
                        }) {
    if (!hasNextAction) {
        toSendResponse && _.forEach(toSendResponse.headers, function (value, key) {
            res.setHeader(key, value);
        });
        return remoteResPipe.pass({
            req, res, urlObj,
            logKey: `fe-proxy-action-${actionIndex}`,
            requestHeaders
        });
    } else {
        return remoteResCache.pass({
            req, res, urlObj,
            logKey: `fe-proxy-action-${actionIndex}`,
            requestHeaders,
            toSendResponse
        })
    }
}