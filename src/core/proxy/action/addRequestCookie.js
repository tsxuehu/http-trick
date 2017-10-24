const Action = require("./action");

const cookie = require("cookie");
const _ = require("lodash");

let addRequestCookie;
module.exports = class AddRequestCookie extends Action {
    static getInstance() {
        if (!addRequestCookie) {
            addRequestCookie = new AddRequestCookie();
        }
        return addRequestCookie;
    }

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return false;
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
        let added = cookie.parse(extraRequestHeaders.Cookie);

        let merged = {};
        Object.assign(merged, cookies, tobeSet, added);

        let arr = [];

        _.forEach(merged, (value, key) => {
            arr.push(`${key}=${value}`)
        });

        extraRequestHeaders.Cookie = arr.join(";");
    }
}