import BaseAction from "service/intercept/action/BaseAction";
import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import vm from "vm";


@Service()
export class ScriptModifyRequestAction extends BaseAction {
    needRequestContent() {
        return true;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return false;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {
            clientIp,
            urlObj,
            originRequestContent,
            additionalRequestQuery,
            additionalRequestHeaders,
            additionalRequestCookies,
            requestRemoteData,
            toClientResponse
        } = context;
        const {action} = extraInfo;

        const sandbox = {
            clientIp,
            urlObj,
            originRequestContent, // 请求内容
            additionalRequestHeaders,// 请求附加头
            additionalRequestQuery,
            additionalRequestCookies,// 请求附加cookie
            requestRemoteData,
            toClientResponse, // 记录返回给浏览器的信息
            console
        };
        try {
            vm.runInNewContext(action.data.modifyRequestScript, sandbox);
        } catch (e) {
            toClientResponse.headers['proxy-error'] = encodeURI(e.message);
        }
    }
}