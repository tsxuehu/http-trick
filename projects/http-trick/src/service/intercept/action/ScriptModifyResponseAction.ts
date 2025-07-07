import BaseAction from "service/intercept/action/BaseAction";
import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import vm from "vm";


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
            urlObj,
            originRequestContent,
            requestRemoteData,
            toClientResponse
        } = context;
        const {action} = extraInfo;

        const sandbox = {
            req,
            clientIp,
            urlObj,
            originRequestContent, // 请求内容
            requestRemoteData,
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