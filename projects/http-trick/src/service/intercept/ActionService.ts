import {Resource, Service} from "di/annotation";
import ProfileService from "service/manage/ProfileService";
import url from "url";
import FilterService from "service/manage/FilterService";
import {RuleDataService} from "service/manage/RuleDataService";
import filter from "lodash/filter";
import lowerCase from "lodash/lowerCase";
import {IAction, IActionInfo, IRule, PassRule} from "service/manage/rule";
import forEach from "lodash/forEach";
import {IOriginRequestData} from "service/intercept/http";
import {BaseAction, EAction} from "service/action";
import {AddQueryAction} from "service/intercept/action/AddQueryAction";
import {AddRequestCookieAction} from "service/intercept/action/AddRequestCookieAction";
import {AddRequestHeaderAction} from "service/intercept/action/AddRequestHeaderAction";
import {AddResponseHeaderAction} from "service/intercept/action/AddResponseHeaderAction";
import {MockDataAction} from "service/intercept/action/MockDataAction";
import {ModifyResponseAction} from "service/intercept/action/ModifyResponseAction";
import {BypassAction} from "service/intercept/action/BypassAction";
import {RedirectAction} from "service/intercept/action/RedirectAction";
import {ScriptModifyRequestAction} from "service/intercept/action/ScriptModifyRequestAction";
import {ScriptModifyResponseAction} from "service/intercept/action/ScriptModifyResponseAction";

/**
 *
 */
@Service()
export default class ActionService {
    @Resource() private profileService: ProfileService
    @Resource() private filterService: FilterService
    @Resource() private ruleDataService: RuleDataService

    @Resource() private addQueryAction: AddQueryAction
    @Resource() private addRequestCookieAction: AddRequestCookieAction
    @Resource() private addRequestHeaderAction: AddRequestHeaderAction
    @Resource() private addResponseHeaderAction: AddResponseHeaderAction
    @Resource() private bypassAction: BypassAction
    @Resource() private mockDataAction: MockDataAction
    @Resource() private modifyResponseAction: ModifyResponseAction
    @Resource() private redirectAction: RedirectAction
    @Resource() private scriptModifyRequestAction: ScriptModifyRequestAction
    @Resource() private scriptModifyResponseAction: ScriptModifyResponseAction


    private actionMap: Record<string, BaseAction> = {}

    async start() {
        this.actionMap = {
            [EAction.addQuery]: this.addQueryAction,
            [EAction.addRequestCookie]: this.addRequestCookieAction,
            [EAction.addRequestHeader]: this.addRequestHeaderAction,
            [EAction.addResponseHeader]: this.addResponseHeaderAction,
            [EAction.bypass]: this.bypassAction,
            [EAction.mockData]: this.mockDataAction,
            [EAction.modifyResponse]: this.modifyResponseAction,
            [EAction.redirect]: this.redirectAction,
            [EAction.scriptModifyRequest]: this.scriptModifyRequestAction,
            [EAction.scriptModifyResponse]: this.scriptModifyResponseAction,
        }
    }

    getAction(actionName: string): BaseAction {
        return this.actionMap[actionName];
    }

    getBypassAction() {
        return this.bypassAction;
    }

    async getActionMap() {
        return this.actionMap
    }

    // 合并所有匹配到的过滤器规则的action列表、请求匹配的规则的 action 列表
    // 动作分为请求前和请求后两种类型, 合并后的顺序，前置过滤器动作 -> 请求匹配到的动作 -> 后置过滤器的动作
    // 合并后的数组 item 格式 {action, rule}， action: 要执行的动作，rule: 动作所属的rule
    getWillRunActionList(userId: string, deviceId: string, method: string, originRequestData: IOriginRequestData): IActionInfo[] {
        const enableFilter = this.profileService.enableFilter(userId);
        const enableRule = this.profileService.enableRule(userId);
        let fRuleLists: IRule[] = []
        if (enableFilter) {
            const allRuleLists = this.filterService.getFilterRuleList(userId);
            fRuleLists = filter(allRuleLists, rule => {
                return rule.checked && this._isMethodMatch(method, rule.method)
                    && this._isUrlMatch(originRequestData.href, rule.match)
            })
        }
        let candidateRule: IRule = PassRule;
        if (enableRule) {
            const inusingRules = this.ruleDataService.getInUseForwardRules(userId);
            for (let i = 0; i < inusingRules.length; i++) {
                let rule = inusingRules[i];
                // 捕获规则
                if (this._isUrlMatch(originRequestData.href, rule.match)
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
    _mergeToRunAction(filterRules: IRule[], processRule: IRule): IActionInfo[] {
        let beforeFilterActionsInfo: IActionInfo[] = [];
        let afterFilterActionsInfo: IActionInfo[] = [];

        forEach(filterRules, rule => {
            forEach(rule.actionList, action => {
                let actionHandler = this.actionMap[action.type];
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

        const ruleActionsInfo: IActionInfo[] = [];
        forEach(processRule.actionList, action => {
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
