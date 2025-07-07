import {Resource, Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import MockDataService from "service/manage/MockDataService";
import {BaseAction} from "service/action";


@Service()
export class MockDataAction extends BaseAction {
    @Resource() private mockDataService: MockDataService

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return true;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {toClientResponse, userId} = context;
        const {action, last} = extraInfo;
        // 获取数据文件id
        const dataId = action.data.dataId;
        const content = await this.mockDataService.getDataFileContent(userId, dataId);
        const contentType = this.mockDataService.getDataFileContentType(userId, dataId);
        toClientResponse.headers['proxy-content'] = `mock data ${dataId}`;
        toClientResponse.headers['Content-Type'] = contentType;

        toClientResponse.hasContent = true;
        toClientResponse.body = content;
    }
}
