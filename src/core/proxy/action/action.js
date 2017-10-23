import AddRequestCookie from "./addRequestCookie";
import AddRequestHeader from "./addRequestHeader";
import Bypass from "./bypass";
import DataMock from "./dataMock";
import ModifyResponse from "./modifyResponse";
import Redirect from "./redirect";

/**
 * 按照处理实际分为三种类型的处理器
 * 1）修改请求
 * 2）获取响应内容
 * 3）修改响应内容
 */
let actionMap;
export default class Action {
    /**
     * 获取所有的action名和 action 映射关系 map
     */
    static getActionMap() {
        if (!actionMap) {
            actionMap = {
                mockData: DataMock.getMockData(),
                addRequestCookie: AddRequestCookie.getAddRequestCookie(),
                addRequestHeader: AddRequestHeader.getAddRequestHeader(),
                modifyResponse: ModifyResponse.getModifyResponse(),
                bypass: Bypass.getBypass(),
                redirect: Redirect.getRedirect()
            };
        }
        return actionMap;
    }

    static getAction(type) {
        return Action.getActionMap()[type];
    }

    static getBypassAction() {
        return Bypass.getBypass();
    }

    /**
     * 动作运行是否需要浏览器的请求内容
     */
    needRequestContent() {
        throw new Error("not implement");
    }

    /**
     * 动作运行是否需要服务器端的返回内容
     */
    needResponse() {
        throw new Error("not implement");
    }

    /**
     * 执行此动作是否获取内容
     * 指示性flag，减少不必要的action执行
     * @returns {boolean}
     */
    willGetContent() {
        throw new Error("not implement");
    }

    /**
     * 运行处理动作
     */
    async run({
                  req,
                  res,
                  urlObj,
                  clientIp,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
                  extraRequestHeaders, // 请求头
                  toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
                  last = true
              }) {
        throw new Error("not implement");
    }
}