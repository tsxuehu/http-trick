const Action = require("./action");


let addQuery;
module.exports = class AddQuery extends Action {
    static getInstance() {
        if (!addQuery) {
            addQuery = new AddQuery();
        }
        return addQuery;
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
                  additionalRequestHeaders, // 请求头
                  actualRequestHeaders,
                  additionalRequestQuery, // query
                  actualRequestQuery,
                  additionalRequestCookies, // cookie
                  actualRequestCookies,
                  toClientResponse, //响应内容
                  last = true
              }) {
        additionalRequestQuery[action.data.queryKey] = action.data.queryValue;
    }
};