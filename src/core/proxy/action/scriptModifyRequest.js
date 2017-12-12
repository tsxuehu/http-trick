const Action = require("./action");
/**
 * 自定义js脚本修改请求内容
 */
let scriptModifyRequest;

module.exports = class ScriptModifyRequest extends Action {

    static getInstance() {
        if (!scriptModifyRequest) {
            scriptModifyRequest = new ScriptModifyRequest();
        }
        return scriptModifyRequest;
    }

    needRequestContent() {
        return true;
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
                  requestContent, // 原始内容
                  requestHeaders, // 请求头
                  requestCookies, // 请求cookie
                  toClientResponse, //响应内容
                  last = true
              }) {


        // 运行用户脚本, 修改请求内容
        // urlObj、requestHeaders、toClientResponse、requestContent中的body

        // 发送请求，获取内容  或者将远端内容直接返回给浏览器
    }
}