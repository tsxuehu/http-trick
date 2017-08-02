/**
 * 执行规则的动作序列
 * yeild 出来的都是promise
 */
var actionMap = require('./index');
var specContentRes = require('../response/specific-content');

function * runRuleActionsGenerator(req, res, urlObj, rule) {


    // 没有动作 则透传
    if (!rule.actionList || rule.actionList.length == 0) {
        return actionMap['bypass'].run({
            req,
            res,
            urlObj,
            actionIndex: 0
        });
    }

    var actionLength = rule.actionList.length;
    var toSendResponse = {
        hasContent: false, // 记录是否保存过数据
        headers: {},
        body: ''
    };
    var requestHeaders = {};
    var sendedToclient = false;

    for (var i = 0; i < actionLength; i++) {
        var action = rule.actionList[i];
        var actionFun = actionMap[action.type];
        // 需要请求内容，若没有 则先加载
        if (actionFun.needResponse && !toSendResponse.hasContent) {
            sendedToclient = yield actionMap['bypass'].run({
                req,
                res,
                urlObj,
                rule,
                action,
                actionIndex: (i-1) + '-1',
                hasNextAction: true,
                requestHeaders,
                toSendResponse
            });
        }
        /**
         * action返回结果Promise 或者 undefined
         */
        sendedToclient = yield actionFun.run({
            req,
            res,
            urlObj,
            rule,
            action,
            actionIndex: i,
            hasNextAction: i < (actionLength - 1), // 是否有后继action
            toSendResponse,
            requestHeaders
        });
        // 如果已经向客户端响应请求则终止执行
        if (sendedToclient) {
            return;
        }
    }
    // 如果还没发送给客户端，则处理响应客户操作
    if (!sendedToclient) {
        if (toSendResponse.hasContent) {
            // 返回指定数据
            specContentRes({
                res,
                statusCode: 200,
                headers: toSendResponse.headers,
                content: toSendResponse.body,
                logKey: `fe-proxy-action-${actionLength}`,
            })
        } else {
            // 向远端请求
            actionMap['bypass'].run({
                req,
                res,
                urlObj,
                actionIndex: actionLength,
                requestHeaders,
                toSendResponse
            });
        }
    }

}
// 运行规则
module.exports = function runAction(req, res, urlObj, rule) {
    var gen = runRuleActionsGenerator(req, res, urlObj, rule);

    function next(data) {
        var result = gen.next(data);
        if (result.done) return result.value;
        result.value.then(data => {
            next(data);
        })
    }

    next();
};
