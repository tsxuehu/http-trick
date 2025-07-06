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

    getFilterRuleList(userId: string): IRule[] {
        return this.filters[userId] || [];
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
        let filePath = path.join(this.filterSaveDir, `${userId}.json`);
        // 将数据写入文件
        await this.fileService.writeJsonToFile(filePath, filters);
        this.emit("data-change", userId, filters);
    }
}
