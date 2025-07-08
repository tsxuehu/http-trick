import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import {BaseAction} from "service/action";


@Service()
export default class AddQueryAction extends BaseAction {
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
        const {additionalRequestQuery} = context;
        const {action} = extraInfo;
        additionalRequestQuery[action.data.queryKey] = action.data.queryValue;
    }
}
