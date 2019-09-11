const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../utils/file");
const path = require('path');
const uuidV4 = require('uuid/v4');

module.exports = class FilterService extends EventEmitter {
  constructor({profileService, appInfoService}) {
    super();
    this._filtersCache = {};
    // user -> filters 映射
    this.filters = {};
    let proxyDataDir = appInfoService.getProxyDataDir();
    this.filterSaveDir = path.join(proxyDataDir, "filter");

    this.profileService = profileService;

  }

  async start() {
    let filterMap = await fileUtil.getJsonFileContentInDir(this.filterSaveDir);
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

  getFilterRuleList(userId) {
    if (this._filtersCache[userId]) {
      return this._filtersCache[userId];
    }

    let userFilters = this.filters[userId] || [];

    this._filtersCache[userId] = userFilters;
    return userFilters;
  }

  async setRuleCheckedState(userId, ruleId, checked) {
    let filters = this.getFilterRuleList(userId)
    for (let rule of filters) {
      if (rule.id == ruleId) {
        rule.checked = checked;
      }
    }
    await this.saveFilters(userId, filters);
  }

  async saveRule(userId, rule) {
    // rule内容参见 webui/src/pages/manager/form-widget/rule-edit-form/Index.vue
    let filters = this.getFilterRuleList(userId);
    if (rule.id) {
      // 修改操作
      let findedRule = filters.find(el => {
        return el.id == rule.id;
      });
      Object.assign(findedRule, rule);
    } else {
      rule.id = uuidV4();
      filters.push(rule);
    }
    await this.saveFilters(userId, filters);
  }

  async removeRule(userId, ruleId) {
    let filters = this.getFilterRuleList(userId);
    filters = filters.filter(rule => {
      return rule.id != ruleId;
    });
    await this.saveFilters(userId, filters);
  }

  async saveFilters(userId, filters) {
    this.filters[userId] = filters;
    delete this._filtersCache[userId];
    let filePath = path.join(this.filterSaveDir, `${userId}.json`);
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
