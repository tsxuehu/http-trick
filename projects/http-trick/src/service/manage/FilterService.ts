import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import path from "path";
import FileService from "service/infra/FileService";
import forEach from "lodash/forEach";
import filter from "lodash/filter";
import lowerCase from "lodash/lowerCase";
import {v4 as uuidV4} from 'uuid';
import url from 'url'
import EventEmitter from "events";
import {IRule} from "service/manage/rule";

@Service()
export default class FilterService extends EventEmitter {

    @Resource() private appInfoService: AppInfoService
    @Resource() private fileService: FileService

    private _filtersCache: Record<string, IRule[]> = {}
    private filters: Record<string, IRule[]> = {} // user -> filters 映射
    private filterSaveDir: string

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.filterSaveDir = path.resolve(dataDir, "filter");

        let filterMap = await this.fileService.getJsonFileContentInDir<IRule[]>(this.filterSaveDir);
        forEach(filterMap, (filters, fileName) => {
            let userId = fileName.slice(0, -5);
            this.filters[userId] = filters;
        });
    }

    async getMatchedRuleList(userId: string, deviceId: string, enable: boolean, method: string, urlObj: url.URL) {
        if (!enable) {
            return [];
        }
        let ruleLists = this.getFilterRuleList(userId);
        return filter(ruleLists, rule => {
            return rule.checked && this._isMethodMatch(method, rule.method)
                && this._isUrlMatch(urlObj.href, rule.match)
        })
    }

    getFilterRuleList(userId: string): IRule[] {
        if (this._filtersCache[userId]) {
            return this._filtersCache[userId];
        }

        let userFilters = this.filters[userId] || [];

        this._filtersCache[userId] = userFilters;
        return userFilters;
    }

    async setRuleCheckedState(userId: string, ruleId: string, checked: boolean) {
        let filters = this.getFilterRuleList(userId)
        for (let rule of filters) {
            if (rule.id == ruleId) {
                rule.checked = checked;
            }
        }
        await this.saveFilters(userId, filters);
    }

    async saveRule(userId: string, rule: IRule) {
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

    async removeRule(userId: string, ruleId: string) {
        let filters = this.getFilterRuleList(userId);
        filters = filters.filter(rule => {
            return rule.id != ruleId;
        });
        await this.saveFilters(userId, filters);
    }

    async saveFilters(userId: string, filters: IRule[]) {
        this.filters[userId] = filters;
        delete this._filtersCache[userId];
        let filePath = path.join(this.filterSaveDir, `${userId}.json`);
        // 将数据写入文件
        await this.fileService.writeJsonToFile(filePath, filters);
        this.emit("data-change", userId, filters);
    }

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod: string, ruleMethod: string) {
        let loweredReqMethod = lowerCase(reqMethod);
        let loweredRuleMethod = lowerCase(ruleMethod);
        return !ruleMethod
            || loweredReqMethod == loweredRuleMethod
            || loweredReqMethod == 'option';
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl: string, ruleMatchStr: string) {
        return !ruleMatchStr || reqUrl.indexOf(ruleMatchStr) >= 0
            || (new RegExp(ruleMatchStr)).test(reqUrl);
    }
}