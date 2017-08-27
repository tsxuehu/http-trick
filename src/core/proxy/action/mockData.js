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

        res.setHeader('fe-proxy-content', encodeURI(filepath));
        if (last) {
            toClientResponse.sendedToClient = true;
            this.local.pipe({
                req,
                res,
                path: filepath,
                contentType
            });
        } else {
            await this.local.pipe({
                req,
                res,
                path: filepath,
                toClientResponse,
                contentType
            });
        }

    }
}