/**
 * Created by tsxuehu on 17/3/19.
 */
const Action = require("./action");
const Repository = require("../../repository");
const sendSpecificToClient = require("../sendToClient/specific");
const addHeaderToResponse = require("../../utils/addHeaderToResponse");

let mockData;
module.exports = class MockData extends Action {
    static getAction() {
        if (!mockData) {
            mockData = new MockData();
        }
        return mockData;
    }

    constructor() {
        super();
        this.mockDataRepository = Repository.getMockDataRepository();
        this.local = Local.getLocal();
    }

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
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
        let content = await this.mockDataRepository.getDataContent(clientIp, dataId);
        let contentType = await this.mockDataRepository.getDataFileContentType(clientIp, dataId);
        toClientResponse.headers['fe-proxy-content'] = `mock data ${dataId}`;
        toClientResponse.headers['Content-Type'] = contentType;
        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            sendSpecificToClient({
                res,
                statusCode: 200,
                headers: toClientResponse.headers,
                content
            });
        } else {
            toClientResponse.body = content;
        }

    }
}