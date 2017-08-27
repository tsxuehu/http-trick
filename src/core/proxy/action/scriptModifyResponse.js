import Action from "./action";
/**
 * 自定义js脚本修改响应内容
 */
export default class ScriptModifyResponse extends Action {


    needResponse() {
        return true;
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
        // 运行用户脚本

        // 发送请求，返回内容
    }
}