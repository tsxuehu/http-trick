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
    constructor({configureService,userService}) {
        this.configureService = configureService;
        this.userService = userService;
    }

    async start(){
        // 读取规则文件

    }
    // 创建规则文件
    createRuleFile(userId, name, description) {

    }
    // 返回用户的规则文件列表
    getRuleFileList(userId) {

    }
    // 删除规则文件
    deleteRuleFile(userId, name) {

    }
    // 设置规则文件的使用状态
    setRuleFileCheckStatus(userId, name, checked) {

    }
    // 获取规则文件的内容
    getRuleFile(userId, name) {

    }
    // 保存规则文件
    saveRuleFile(userId, name, content) {

    }
    //
    getRemoteRuleFile(userId, url) {

    }

    /**
     * 根据请求,获取处理请求的规则
     * @param method
     * @param urlObj
     */
    getProcessRuleList(userId, method, urlObj) {
        let candidateRule = null;
        if (this.configureService.enableRule(userId)) {
            // 规则匹配部分
            let inusingRules = this._getInuseRules(userId);
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

    _getInuseRules(userId) {

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