import Action from './action'
import calcPath  from '../../utils/calcPath'
import specContentRes  from '../response/specific-content'
import sendToClientError  from '../sendToClient/error'
import sendToClientSpecific  from '../sendToClient/specific'
import localResCache from '../response/local-cache'
import localResPipe  from '../response/local-pipe'
import remoteResCache  from '../response/remote-cache'
import remoteResPipe  from '../response/remote-pipe'
import _ from 'lodash'
/**
 * 重定向 本地 或者 远程
 */
export default class Redirect extends Action{
    static getRedirect(){

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

/**
 * 重定向到另一个远程地址
 */

/**
 *
 * @param req
 * @param res
 * @param urlObj
 * @param data
 * @param match
 */
exports.run = function ({
                            req, res, urlObj, rule, action,
                            actionIndex, hasNextAction, requestHeaders, toSendResponse
                        }) {

    //================== 转发到本地 或远程
    // 解析目标
    var target = calcPath(urlObj.href, rule.match, action.data.target);
    if (!target) {
        errorRes(req, res, 500, 'target parse error' + action.data.target);
        return Promise.resolve(true);
    }

    if (!hasNextAction) {
        _.forEach(toSendResponse.headers, function (value, key) {
            res.setHeader(key, value);
        });
    }

    if (target.startsWith('http')) {
        if (!hasNextAction) {
            return remoteResPipe.redirect({
                req, res, urlObj, target,
                logKey: `fe-proxy-action-${actionIndex}`,
                requestHeaders
            });
        } else {
            return remoteResCache.redirect({
                req, res, urlObj, target,
                logKey: `fe-proxy-action-${actionIndex}`,
                requestHeaders,
                toSendResponse
            })
        }
    } else {
        // 本地文件
        if (!hasNextAction) {
            return localResPipe({
                req, res,
                path: target,
                logKey: `fe-proxy-action-${actionIndex}`
            });
        } else {
            return localResCache({
                req, res,
                path: target,
                logKey: `fe-proxy-action-${actionIndex}`,
                toSendResponse
            });
        }
    }
};