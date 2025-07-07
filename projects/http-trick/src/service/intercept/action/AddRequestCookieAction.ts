import BaseAction from "service/intercept/action/BaseAction";
import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";


@Service()
export class AddRequestCookieAction extends BaseAction {
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