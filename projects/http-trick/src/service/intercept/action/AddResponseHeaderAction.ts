import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import {BaseAction} from "service/action";


@Service()
export default class AddResponseHeaderAction extends BaseAction {
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
        const {toClientResponse} = context;
        const {action} = extraInfo;
        toClientResponse.headers[action.data.resHeaderKey] = action.data.resHeaderValue;
    }
}
