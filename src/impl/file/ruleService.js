const _ = require( "lodash");


let passRule = {
    "method": "",
    "match": "",
    "actionList": [{
        "type": "bypass",
    }]
};
// 
module.exports = class RuleService {
    constructor({configureRepository}) {
        this.configureRepository = configureRepository;
    }

    start(){

    }

    createRuleFile(userId, name, description) {

    }

    getRuleFileList(userId) {

    }

    deleteRuleFile(userId, name) {

    }

    setRuleFileCheckStatus(userId, name, checked) {

    }

    getRuleFile(userId, name) {

    }

    saveRuleFile(userId, name, content) {

    }

    getRemoteRuleFile(userId, url) {

    }

    /**
     * 根据请求,获取处理请求的规则
     * @param method
     * @param urlObj
     */
    getProcessRuleList(clientIp, method, urlObj) {
        let candidateRule = null;
        if (this.configureRepository.getEnableRule(clientIp)) {
            // 规则匹配部分
            let inusingRules = this._getInuseRules(clientIp);
            for (let i = 0; i < inusingRules.length; i++) {
                let rule = inusingRules[i];
                // 捕获规则
                if (this._isUrlMatch(urlObj.href, rule.match)
                    && this._isMethodMatch(method, rule.method)) {
                    candidateRule = rule;
                    break
                }
            }
        }
        // 查找规则，如果找不到则返回透传规则
        if (!candidateRule) {
            candidateRule = passRule
        }
        return candidateRule;
    }

    _getInuseRules(clientIp) {

    }

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod, ruleMethod) {
        let loweredReqMethod = _.lowerCase(reqMethod);
        let loweredRuleMethod = _.lowerCase(ruleMethod);
        return loweredReqMethod == loweredRuleMethod
            || !ruleMethod
            || loweredReqMethod == 'option';
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl, ruleMatchStr) {
        return ruleMatchStr && (reqUrl.indexOf(ruleMatchStr) >= 0
            || (new RegExp(ruleMatchStr)).test(reqUrl));
    }
}