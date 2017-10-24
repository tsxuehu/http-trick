const Action = require("./action");
const _ = require("lodash");

let addRequestHeader;
/**
 * 增加请求头
 */
module.exports = class AddRequestHeader extends Action {
    static getInstance() {
        if (!addRequestHeader) {
            addRequestHeader = new AddRequestHeader();
        }
        return addRequestHeader;
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
                  requestContent, // 请求内容
                  extraRequestHeaders, // 请求头
                  toClientResponse, //响应内容
                  last = true
              }) {
        _.assign(extraRequestHeaders, action.data.headers);
    }
}