import Action from "./action";

import cookie from "cookie";
import _ from "lodash";

let addRequestCookie;
export default class AddRequestCookie extends Action {
    static getAddRequestCookie() {
        if (!addRequestCookie) {
            addRequestCookie = new AddRequestCookie();
        }
        return addRequestCookie;
    }

    async run({
                  req,
                  res,
                  urlObj,
                  clientIp,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 请求内容
                  extraRequestHeaders, // 请求头
                  toClientResponse, //响应内容
                  last = true
              }) {
        let cookies = cookie.parse(req.headers.cookie);
        let tobeSet = cookie.parse(action.data.cookie);

        _.forEach(tobeSet, (value, key) => {
            cookies[key] = value;
        });

        let arr = [];

        _.forEach(cookies, (value, key) => {
            arr.push(`${key}=${value}`)
        });

        extraRequestHeaders.Cookie = arr.join(";");
    }
}