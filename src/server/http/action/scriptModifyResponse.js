const Action = require("./action");
const vm = require('vm');

/**
 * 自定义js脚本修改响应内容
 */

let scriptModifyResponse;
module.exports = class ScriptModifyResponse extends Action {

    static getInstance() {
        if (!scriptModifyResponse) {
            scriptModifyResponse = new ScriptModifyResponse();
        }
        return scriptModifyResponse;
    }

    needRequestContent() {
        return false;
    }

    needResponse() {
        return true;
    }

    willGetContent() {
        return false;
    }

    async run({
                  req,
                  res,
                  urlObj,
                  clientIp,
                  deviceId,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 原始请求内容
                  additionalRequestHeaders, // 请求头
                  actualRequestHeaders,
                  additionalRequestQuery, // query
                  actualRequestQuery,
                  additionalRequestCookies, // cookie
                  actualRequestCookies,
                  toClientResponse, //响应内容
                  last = true
              }) {
        // 运行用户脚本
        const sandbox = { toClientResponse ,console, urlObj, req};
        // 发送请求，返回内容
        try {
            vm.runInNewContext(action.data.modifyResponseScript, sandbox);
        } catch (e) {
            toClientResponse.headers['proxy-error'] = encodeURI(e.message);
        }
    }
};
