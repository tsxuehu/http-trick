import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import vm from "vm";
import {BaseAction} from "service/action";


@Service()
export class ScriptModifyResponseAction extends BaseAction {
    needRequestContent() {
        return false;
    }

    needResponse() {
        return true;
    }

    willGetContent() {
        return false;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {
            clientIp,
            req,
            originRequestData,
            actualRequestData,
            toClientResponse
        } = context;
        const {action} = extraInfo;

        const sandbox = {
            req,
            clientIp,
            originRequestContent: originRequestData, // 请求内容
            requestRemoteData: actualRequestData,
            toClientResponse, // 记录返回给浏览器的信息
            console
        };
        try {
            vm.runInNewContext(action.data.modifyResponseScript, sandbox);
        } catch (e) {
            toClientResponse.headers['proxy-error'] = encodeURI(e.message);
        }
    }
}
