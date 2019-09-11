const _ = require("lodash");
const fileUtil = require("../utils/file");
const path = require('path');
const EventEmitter = require("events");
const uuidV4 = require('uuid/v4');

const PassRule = {
  "method": "",
  "match": "",
  "actionList": [{
    "type": "bypass",
  }]
};
//
module.exports = class RuleService extends EventEmitter {
  constructor({profileService, appInfoService}) {
    super();
    this.profileService = profileService;
    // userId - > (filename -> rule)
    this.rules = {};
    // 缓存数据: 正在使用的规则 userId -> inUsingRuleList
    this.usingRuleCache = {};
    this.appInfoService = appInfoService;

    let proxyDataDir = this.appInfoService.getProxyDataDir();
    this.ruleSaveDir = path.join(proxyDataDir, "rule");
  }

  async start() {
    // 读取规则文件
    let contentMap = await fileUtil.getJsonFileContentInDir(this.ruleSaveDir);
    _.forEach(contentMap, (content, fileName) => {
      let ruleFileId = content.id;
      let userId = content.userId;
      this.rules[userId] = this.rules[userId] || {};
      this.rules[userId][ruleFileId] = content;
    })
  }

  // 创建规则文件
  async createRuleFile(userId, name, description) {
    if (this.rules[userId] && this.rules[userId][name]) {
      return false;
    }
    let ruleFileId = uuidV4();
    let ruleFile = {
      "id": ruleFileId,
      "userId": userId,
      "meta": {
        "remote": false,
        "url": ""
      },
      "checked": false,
      "name": name,
      "description": description,
      "content": [] // 规则内容参见 webui/src/pages/manager/form-widget/rule-edit-form/Index.vue
    };
    this.rules[userId] = this.rules[userId] || {};
    this.rules[userId][name] = ruleFile;
    // 写文件
    let filePath = this._getRuleFilePath(userId, ruleFileId);
    await fileUtil.writeJsonToFile(filePath, ruleFile);
    // 发送消息通知
    this.emit('data-change', userId, this.getRuleFileList(userId));
    return ruleFileId;
  }

  // 返回用户的规则文件列表
  getRuleFileList(userId) {
    let ruleMap = this.rules[userId] = this.rules[userId] || {};

    let rulesLocal = [];
    _.forEach(ruleMap, function (content) {
      rulesLocal.push({
        id: content.id,
        name: content.name,
        checked: content.checked,
        description: content.description,
        meta: content.meta
      });
    });
    return rulesLocal;
  }

  // 删除规则文件
  deleteRuleFile(userId, ruleFileId) {
    let rule = this.rules[userId][ruleFileId];

    delete this.rules[userId][ruleFileId];

    let path = this._getRuleFilePath(userId, ruleFileId);
    fileUtil.deleteFile(path);
    // 发送消息通知
    this.emit('data-change', userId, this.getRuleFileList(userId));
    if (rule.checked) {
      // 清空缓存
      delete this.usingRuleCache[userId];
    }
  }

  // 设置规则文件的使用状态
  async setRuleFileCheckStatus(userId, ruleFileId, checked) {
    this.rules[userId][ruleFileId].checked = checked;
    let path = this._getRuleFilePath(userId, ruleFileId);
    await fileUtil.writeJsonToFile(path, this.rules[userId][ruleFileId]);
    // 发送消息通知
    this.emit('data-change', userId, this.getRuleFileList(userId));
    delete this.usingRuleCache[userId];
  }

  // 获取规则文件的内容
  getRuleFile(userId, ruleFileId) {
    return this.rules[userId][ruleFileId];
  }

  // 保存规则文件(可能是远程、或者本地)
  saveRuleFile(userId, ruleFileId, fileContent) {
    if (!ruleFileId) {
      ruleFileId = uuidV4();
      fileContent.id = ruleFileId;
    }
    let userRuleMap = this.rules[userId] || {};
    userRuleMap[ruleFileId] = fileContent;
    this.rules[userId] = userRuleMap;
    // 写文件
    let filePath = this._getRuleFilePath(userId, ruleFileId);
    fileUtil.writeJsonToFile(filePath, userRuleMap[ruleFileId]);
    // 清空缓存
    delete this.usingRuleCache[userId];
  }

  /**
   * 根据请求,获取处理请求的规则
   * @param method
   * @param urlObj
   */
  getProcessRule(userId, deviceId, enable, method, urlObj) {
    let candidateRule = null;
    if (enable) {
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
      candidateRule = PassRule
    }
    return candidateRule;
  }

  _getInuseRules(userId) {
    if (this.usingRuleCache[userId]) {
      return this.usingRuleCache[userId];
    }
    let ruleMap = this.rules[userId] || {};
    // 计算使用中的规则
    let rulesLocal = [];
    _.forEach(ruleMap, function (fileContent, ruleFileId) {
      if (!fileContent.checked) return;
      _.forEach(fileContent.content, function (rule) {
        if (!rule.checked) return;

        let copy = JSON.parse(JSON.stringify(rule));
        copy.ruleFileName = fileContent.name;
        rulesLocal.push(copy);
      });
    });
    this.usingRuleCache[userId] = rulesLocal;
    return rulesLocal;
  }

  _getRuleFilePath(userId, ruleFileId) {
    let fileName = `${userId}_${ruleFileId}.json`;
    let filePath = path.join(this.ruleSaveDir, fileName);
    return filePath;
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
