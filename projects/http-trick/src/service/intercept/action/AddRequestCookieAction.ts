import {BaseAction} from "service/action";
import {Service} from "@spring4js/container-node";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";


@Service()
export default class AddRequestCookieAction extends BaseAction {
    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return false;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {additionalRequestCookies} = context;
        const {action} = extraInfo;
        additionalRequestCookies[action.data.cookieKey] = action.data.cookieValue;
    }
}
