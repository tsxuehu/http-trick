/**
 * Created by tsxuehu on 17/3/19.
 */
import Action from "./action";
import Repository from "../../repository";
import Local from "../content/local";

export default class MockData extends Action {
    static getMockData() {

    }

    constructor() {
        super();
        this.mockDataRepository = Repository.getMockDataRepository();
        this.local = Local.getLocal();
    }

    willGetContent() {
        return true;
    }

    /**
     * 运行处理动作
     */
    async run({
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
        // 获取数据文件id
        let dataId = action.data.dataId;
        let filepath = this.mockDataRepository.getDataFilePath(clientIp, dataId);
        let contentType = this.mockDataRepository.getDataFileContentType(clientIp, dataId);

        if (last) {
            toClientResponse.sendedToClient = true;
            this.local.pipe({
                req,
                res,
                path: target
            });
        } else {
            await this.local.pipe({
                req,
                res,
                path: target,
                toClientResponse
            });
        }

    }
}

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
