import {Resource, Service} from "di/annotation";
import ProfileService from "service/manage/ProfileService";
import url from "url";
import FilterService from "service/manage/FilterService";
import {RuleDataService} from "service/manage/RuleDataService";
import filter from "lodash/filter";
import lowerCase from "lodash/lowerCase";
import {IAction, IRule, PassRule} from "service/manage/rule";
import forEach from "lodash/forEach";
import _ from "lodash";

/**
 *
 */
@Service()
export default class ActionService {
    @Resource() private profileService: ProfileService
    @Resource() private filterService: FilterService
    @Resource() private ruleDataService: RuleDataService

    getWillRunActionList(userId: string, deviceId: string, method: string, urlObj: url.URL) {
        const enableFilter = this.profileService.enableFilter(userId);
        const enableRule = this.profileService.enableRule(userId);
        let fRuleLists: IRule[] = []
        if (enableFilter) {
            const allRuleLists = this.filterService.getFilterRuleList(userId);
            fRuleLists = filter(allRuleLists, rule => {
                return rule.checked && this._isMethodMatch(method, rule.method)
                    && this._isUrlMatch(urlObj.href, rule.match)
            })
        }
        let candidateRule: IRule = PassRule;
        if (enableRule) {
            const inusingRules = this.ruleDataService.getInUseForwardRules(userId);
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

        return this._mergeToRunAction(fRuleLists, candidateRule)
    }

    // 合并过滤规则，和请求处理规则
    // 生成要执行的action列表
    _mergeToRunAction(filterRules: IRule[], processRule: IRule): IAction[] {
        let beforeFilterActionsInfo: IAction[] = [];
        let afterFilterActionsInfo: IAction[] = [];

        _.forEach(filterRules, rule => {
            _.forEach(rule.actionList, action => {
                let actionHandler = Action.getAction(action.type);
                if (actionHandler.needResponse()) {
                    afterFilterActionsInfo.push({
                        action: action, // 动作
                        rule: rule // 动作关联的规则
                    });
                } else {
                    beforeFilterActionsInfo.push({
                        action: action,
                        rule: rule
                    });
                }
            });
        });

        const ruleActionsInfo: IAction[] = [];
        _.forEach(processRule.actionList, action => {
            ruleActionsInfo.push({
                action: action,
                rule: processRule
            });
        });
        return beforeFilterActionsInfo.concat(ruleActionsInfo).concat(afterFilterActionsInfo);
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
