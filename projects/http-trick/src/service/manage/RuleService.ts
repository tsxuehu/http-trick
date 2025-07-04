import {Resource, Service} from "di/annotation";
import FileService from "service/infra/FileService";
import AppInfoService from "service/AppInfoService";
import ProfileService from "service/manage/ProfileService";
import path from "path";
import forEach from "lodash/forEach";
import lowerCase from "lodash/lowerCase";
import {IRule, IRuleFile, IRuleFileSimple, PassRule} from "service/manage/rule";
import {v4 as uuidV4} from 'uuid';
import EventEmitter from "events";
import url from 'url'

@Service()
export class RuleService extends EventEmitter {
    @Resource() private fileService: FileService
    @Resource() private appInfoService: AppInfoService
    @Resource() private profileService: ProfileService

    private rules: Record<string, Record<string, IRuleFile>> = {}; // userId - > (filename -> rule)
    private usingRuleCache: Record<any, any> = {};
    private ruleSaveDir: string

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.ruleSaveDir = path.resolve(dataDir, "rule");

        let contentMap = await this.fileService.getJsonFileContentInDir<IRuleFile>(this.ruleSaveDir);
        forEach(contentMap, (content, fileName) => {
            let ruleFileId = content.id;
            let userId = content.userId;
            this.rules[userId] = this.rules[userId] || {};
            this.rules[userId][ruleFileId] = content;
        })
    }

    // 创建规则文件
    async createRuleFile(userId: string, name: string, description: string): Promise<string> {
        if (this.rules[userId] && this.rules[userId][name]) {
            return '';
        }
        let ruleFileId = uuidV4();
        let ruleFile: IRuleFile = {
            "id": ruleFileId,
            "userId": userId,
            "meta": {
                "remote": false,
                "url": ""
            },
            "checked": false,
            "name": name,
            "description": description,
            "ruleList": [] // 规则内容参见 webui/src/pages/manager/form-widget/rule-edit-form/Index.vue
        };
        this.rules[userId] = this.rules[userId] || {};
        this.rules[userId][ruleFileId] = ruleFile;
        // 写文件
        let filePath = this._getRuleFilePath(userId, ruleFileId);
        await this.fileService.writeJsonToFile(filePath, ruleFile);
        // 发送消息通知
        this.emit('data-change', userId, this.getRuleFileList(userId));
        return ruleFileId;
    }

    // 返回用户的规则文件列表
    getRuleFileList(userId: string): IRuleFileSimple[] {
        let ruleMap = this.rules[userId] = this.rules[userId] || {};

        let rulesLocal: IRuleFileSimple[] = [];
        forEach(ruleMap, function (content) {
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
    async deleteRuleFile(userId: string, ruleFileId: string) {
        let rule = this.rules[userId][ruleFileId];

        delete this.rules[userId][ruleFileId];

        let path = this._getRuleFilePath(userId, ruleFileId);
        await this.fileService.deleteFile(path);
        // 发送消息通知
        this.emit('data-change', userId, this.getRuleFileList(userId));
        if (rule.checked) {
            // 清空缓存
            delete this.usingRuleCache[userId];
        }
    }

    // 设置规则文件的使用状态
    async setRuleFileCheckStatus(userId: string, ruleFileId: string, checked: boolean) {
        this.rules[userId][ruleFileId].checked = checked;
        let path = this._getRuleFilePath(userId, ruleFileId);
        await this.fileService.writeJsonToFile(path, this.rules[userId][ruleFileId]);
        // 发送消息通知
        this.emit('data-change', userId, this.getRuleFileList(userId));
        delete this.usingRuleCache[userId];
    }

    // 获取规则文件的内容
    getRuleFile(userId: string, ruleFileId: string) {
        return this.rules[userId][ruleFileId];
    }

    // 保存规则文件(可能是远程、或者本地)
    async saveRuleFile(userId: string, ruleFileId: string, fileContent: IRuleFile) {
        let needNotify = false;
        if (!ruleFileId) {
            needNotify = true;
            ruleFileId = uuidV4();
            fileContent.id = ruleFileId;
        }
        fileContent.userId = userId;
        let userRuleMap = this.rules[userId] || {};
        userRuleMap[ruleFileId] = fileContent;
        this.rules[userId] = userRuleMap;
        // 写文件
        let filePath = this._getRuleFilePath(userId, ruleFileId);
        await this.fileService.writeJsonToFile(filePath, userRuleMap[ruleFileId]);
        // 清空缓存
        delete this.usingRuleCache[userId];
        if (needNotify) {
            this.emit('data-change', userId, this.getRuleFileList(userId));
        }
    }

    // 保存规则
    async setRuleCheckedState(userId: string, ruleFileId: string, ruleId: string, checked: boolean) {
        let ruleFileContent = this.getRuleFile(userId, ruleFileId);
        for (let rule of ruleFileContent.ruleList) {
            if (rule.id == ruleId) {
                rule.checked = checked;
            }
        }
        await this.saveRuleFile(userId, ruleFileId, ruleFileContent);
    }


    async saveRule(userId: string, ruleFileId: string, rule: IRule) {
        // rule内容参见 webui/src/pages/manager/form-widget/rule-edit-form/Index.vue
        let ruleFileContent = this.getRuleFile(userId, ruleFileId);
        if (rule.id) {
            // 修改操作
            let findedRule = ruleFileContent.ruleList.find(el => {
                return el.id == rule.id;
            });
            Object.assign(findedRule, rule);
        } else {
            rule.id = uuidV4();
            ruleFileContent.ruleList.push(rule);
        }
        await this.saveRuleFile(userId, ruleFileId, ruleFileContent);
    }

    async removeRule(userId: string, ruleFileId: string, ruleId: string) {
        let ruleFileContent = this.getRuleFile(userId, ruleFileId);
        ruleFileContent.ruleList = ruleFileContent.ruleList.filter(rule => {
            return rule.id != ruleId;
        });
        await this.saveRuleFile(userId, ruleFileId, ruleFileContent);
    }

    /**
     * 根据请求,获取处理请求的规则
     * @param method
     * @param urlObj
     */
    getProcessRule(userId: string, deviceId: string, enable: boolean, method: string, urlObj: url.URL) {
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

    _getInuseRules(userId: string) {
        if (this.usingRuleCache[userId]) {
            return this.usingRuleCache[userId];
        }
        let ruleMap = this.rules[userId] || {};
        // 计算使用中的规则
        let rulesLocal: IRule[] = [];
        forEach(ruleMap, function (fileContent, ruleFileId) {
            if (!fileContent.checked) return;
            forEach(fileContent.ruleList, function (rule) {
                if (!rule.checked) return;

                let copy = JSON.parse(JSON.stringify(rule));
                copy.ruleFileName = fileContent.name;
                rulesLocal.push(copy);
            });
        });
        this.usingRuleCache[userId] = rulesLocal;
        return rulesLocal;
    }

    _getRuleFilePath(userId: string, ruleFileId: string) {
        let fileName = `${userId}_${ruleFileId}.json`;
        let filePath = path.join(this.ruleSaveDir, fileName);
        return filePath;
    }

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod: string, ruleMethod: string) {
        let loweredReqMethod = lowerCase(reqMethod);
        let loweredRuleMethod = lowerCase(ruleMethod);
        return loweredReqMethod == loweredRuleMethod
            || !ruleMethod
            || loweredReqMethod == 'option';
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl: string, ruleMatchStr: string) {
        return ruleMatchStr && (reqUrl.indexOf(ruleMatchStr) >= 0
            || (new RegExp(ruleMatchStr)).test(reqUrl));
    }
}