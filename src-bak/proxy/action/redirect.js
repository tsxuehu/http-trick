/**
 * 重定向到另一个远程地址
 */
var calcPath = require('../../utils/calcPath').calcPath;
var notify = require('../../notify');
var dc = require('../../datacenter');
var specContentRes = require('../response/specific-content');
var errorRes = require('../response/error');
var localResCache = require('../response/local-cache');
var localResPipe = require('../response/local-pipe');
var remoteResCache = require('../response/remote-cache');
var remoteResPipe = require('../response/remote-pipe');
var _ = require('lodash');
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