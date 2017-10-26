const EventEmitter = require("events");
const _ = require("lodash");

module.exports = class FilterService extends EventEmitter {
    constructor({userService}) {
        super();
        // user -> filters 映射
        this.filters = {};
        this.userService = userService;
    }

    start() {

    }

    async getMatchedRuleList(userId, method, urlObj) {
        let ruleLists = await this.getFilterRuleList(userId);
        return _.filter(ruleLists, rule => {
            return this._isMethodMatch(method, rule.method)
                && this._isUrlMatch(urlObj.href, rule.match)
        })
    }

    async getFilterRuleList(userId) {
        return this.filters[userId] || [];
    }

    save(userId, filters) {
        this.filters[userId] = filters;
        this.emit("data-change", userId, filters);
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