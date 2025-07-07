import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import vm from "vm";
import {BaseAction} from "service/action";


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
            originRequestData,
            additionalRequestQuery,
            additionalRequestHeaders,
            additionalRequestCookies,
            actualRequestData,
            toClientResponse
        } = context;
        const {action} = extraInfo;

        const sandbox = {
            clientIp,
            originRequestContent: originRequestData, // 请求内容
            additionalRequestHeaders,// 请求附加头
            additionalRequestQuery,
            additionalRequestCookies,// 请求附加cookie
            requestRemoteData: actualRequestData,
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
