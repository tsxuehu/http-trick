const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');
const DefaultFilters = require('./filter-default');

module.exports = class FilterService extends EventEmitter {
    constructor({profileService, appInfoService}) {
        super();
        this._filtersCache = {};
        // user -> filters 映射
        this.filters = {};
        let proxyDataDir = appInfoService.getProxyDataDir();
        this.breakpointSaveDir = path.join(proxyDataDir, "filter");

        this.profileService = profileService;

    }

    async start() {
        let filterMap = await fileUtil.getJsonFileContentInDir(this.breakpointSaveDir);
        _.forEach(filterMap, (filters, fileName) => {
            let userId = fileName.slice(0, -5);
            this.filters[userId] = filters;
        });
    }

    async getMatchedRuleList(userId, deviceId, enable, method, urlObj) {
        if (!enable) {
            return [];
        }
        let ruleLists = await this.getFilterRuleList(userId);
        return _.filter(ruleLists, rule => {
            return rule.checked && this._isMethodMatch(method, rule.method)
                && this._isUrlMatch(urlObj.href, rule.match)
        })
    }

    async getFilterRuleList(userId) {
        if (this._filtersCache[userId]) {
            return this._filtersCache[userId];
        }

        let userFilters = this.filters[userId] || [];
        if (userFilters.length == 0) return DefaultFilters;

        let keysMap = {};
        userFilters.forEach(f => {
            keysMap[f.key] = 1;
        });
        // 取出需要的默认filter
        let finalFilters = [];
        DefaultFilters.forEach(f => {
            if (!keysMap[f.key]) {
                finalFilters.push(f);
            }
        });
        finalFilters = finalFilters.concat(userFilters);
        this._filtersCache[userId] = finalFilters;
        return finalFilters;
    }

    async save(userId, filters) {
        filters.forEach(f => {
            f.default = false;
        });
        this.filters[userId] = filters;
        delete this._filtersCache[userId];
        let filePath = path.join(this.breakpointSaveDir, `${userId}.json`);
        // 将数据写入文件
        await fileUtil.writeJsonToFile(filePath, filters);
        this.emit("data-change", userId, filters);
    }

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod, ruleMethod) {
        let loweredReqMethod = _.lowerCase(reqMethod);
        let loweredRuleMethod = _.lowerCase(ruleMethod);
        return !ruleMethod
            || loweredReqMethod == loweredRuleMethod
            || loweredReqMethod == 'option';
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl, ruleMatchStr) {
        return !ruleMatchStr || reqUrl.indexOf(ruleMatchStr) >= 0
            || (new RegExp(ruleMatchStr)).test(reqUrl);
    }
}
