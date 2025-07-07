import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import lowerCase from "lodash/lowerCase";
import cookie from "cookie";
import {BaseAction} from "service/action";


@Service()
export class AddRequestHeaderAction extends BaseAction {
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
        const {additionalRequestCookies, additionalRequestHeaders, deviceId} = context;
        const {action} = extraInfo;
        if (lowerCase(action.data.reqHeaderKey) == "cookie") {
            let toAddCookie = cookie.parse(action.data.reqHeaderValue || "");
            Object.assign(additionalRequestCookies, toAddCookie);
        } else {
            let value = action.data.reqHeaderValue;
            if (value == '$deviceId') {
                value = deviceId;
            }
            additionalRequestHeaders[action.data.reqHeaderKey] = value;
        }
    }
}
