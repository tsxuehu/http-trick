import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";

export enum EAction {
    addQuery = 'addQuery',
    addRequestCookie = 'addRequestCookie',
    addRequestHeader = 'addRequestHeader',
    addResponseHeader = 'addResponseHeader',
    bypass = 'bypass',
    mockData = 'mockData',
    modifyResponse = 'modifyResponse',
    redirect = 'redirect',
    scriptModifyRequest = 'scriptModifyRequest',
    scriptModifyResponse = 'scriptModifyResponse',
}


export class BaseAction {
    needRequestContent(): boolean {
        throw new Error("not implement");
    }

    needResponse(): boolean {
        throw new Error("not implement");
    }

    willGetContent(): boolean {
        throw new Error("not implement");
    }

    async run(
        context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        throw new Error("not implement");
    }
}
