import AddRequestCookie from "./addRequestCookie";
import AddRequestHeader from "./addRequestHeader";
import Bypass from "./bypass";
import DataMock from "./dataMock";
import ModifyResponseBody from "./modifyResponseBody";
import ModifyResponseHeader from "./modifyResponseHeader";
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
                data: DataMock.getDataMock(),
                addRequestCookie: AddRequestCookie.getAddRequestCookie(),
                addRequestHeader: AddRequestHeader.getAddRequestHeader(),
                modifyResponseBody: ModifyResponseBody.getModifyResponseBody(),
                modifyResponseHeader: ModifyResponseHeader.getModifyResponseHeader(),
                bypass: Bypass.getBypass(),
                redirect: Redirect.getRedirect()
            };
        }
        return actionMap;
    }

    /**
     * 动作运行是否需要返回内容
     */
    needResponse() {
        return false;
    }

    /**
     * 运行处理动作
     */
    run({
            req,
            res,
            urlObj,
            rule, // 规则
            action, // 规则里的一个动作
            requestHeaders, // 请求头
            toSendResponse //响应内容
        }) {

    }
}