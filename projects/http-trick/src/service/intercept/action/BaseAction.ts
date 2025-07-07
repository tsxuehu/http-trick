import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";

export default class BaseAction {

    /**
     * 动作运行是否需要浏览器的请求内容
     */
    needRequestContent(): boolean {
        throw new Error("not implement");
    }

    /**
     * 动作运行是否需要服务器端的返回内容
     */
    needResponse(): boolean {
        throw new Error("not implement");
    }

    /**
     * 执行此动作是否获取内容
     * 指示性flag，减少不必要的action执行
     */
    willGetContent(): boolean {
        throw new Error("not implement");
    }

    /**
     * 运行处理动作
     */
    async run(
        context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        throw new Error("not implement");
    }
}
