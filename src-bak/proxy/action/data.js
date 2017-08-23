/**
 * Created by tsxuehu on 17/3/19.
 */
var dc = require('../../datacenter');
var localResCache = require('../response/local-cache');
var localResPipe = require('../response/local-pipe');
var errorRes = require('../response/error');
var _ = require('lodash');
/**
 * 返回自定义数据
 * @param req
 * @param res
 * @param urlObj
 * @param data
 * @param match
 */
exports.run = function ({
                            req, res,
                            action, actionIndex,
                            hasNextAction, toSendResponse
                        }) {
    // 获取数据文件id
    var dataId = action.data.dataId;
    var filepath = dc.getDataFilePath(dataId);

    if (filepath && dataId) {
        if (!hasNextAction) {

            _.forEach(toSendResponse.headers, function (value, key) {
                res.setHeader(key, value);
            });

            return localResPipe({
                req, res,
                path: filepath,
                contentType: dc.getDataFileContentType(dataId),
                logKey: `fe-proxy-action-${actionIndex}`
            });
        } else {
            return localResCache({
                req, res,
                path: filepath,
                logKey: `fe-proxy-action-${actionIndex}`,
                contentType: dc.getDataFileContentType(dataId),
                toSendResponse
            });
        }
    } else {
        errorRes(req, res, 500, 'data file not exist');
    }
}
