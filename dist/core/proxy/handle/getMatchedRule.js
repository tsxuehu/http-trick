'use strict';

var _ = require('lodash');
var dc = require('../../datacenter');
var notify = require('../../notify');
/**
 * 返回匹配到的规则，规则中包含处理管道，管道执行器更具管道信息处理请求返回结果
 * option请求特殊处理
 *  {
 *      type: userRule | option
 *      rule:
 *  }
 *
 */
module.exports = function getHandler(req, urlObj) {
    var respondInfo = {
        type: '',
        info: '', // 匹配的规则信息
        rule: {}
    };
    var method = req.method;

    // 规则匹配部分
    var inusingRules = dc.getInuseRules();
    for (var i = 0; i < inusingRules.length; i++) {
        var rule = inusingRules[i];
        // 捕获规则
        if (isUrlMatch(urlObj.href, rule.match) && isMethodMatch(method, rule.method)) {
            respondInfo.info = rule.rcName + '/-/' + rule.method + '/-/' + rule.match + '';
            if (!dc.getConf().enableRule) {
                respondInfo.info = respondInfo.info + '/-/rule-not-enabled';
            } else {
                respondInfo.type = 'userRule';
                respondInfo.rule = rule;
            }
            return respondInfo;
        }
    }
    return respondInfo;
};

function isMethodMatch(reqMethod, ruleMethod) {
    var loweredReqMethod = _.lowerCase(reqMethod);
    var loweredRuleMethod = _.lowerCase(ruleMethod);
    return loweredReqMethod == loweredRuleMethod || !ruleMethod || loweredReqMethod == 'option';
}
function isUrlMatch(reqUrl, ruleMatchStr) {
    return ruleMatchStr && (reqUrl.indexOf(ruleMatchStr) >= 0 || new RegExp(ruleMatchStr).test(reqUrl));
}