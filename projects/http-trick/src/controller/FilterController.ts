import {Controller, Path, Resource} from "@spring4js/container-node";
import {HttpMethod} from "@spring4js/container-node";
import {Context, Next} from "koa";
import FilterService from "service/manage/FilterService";

@Controller('/filter/')
export default class FilterController {
    @Resource()
    private filterService: FilterService

    @Path('setRuleCheckedState', HttpMethod.GET)
    async setRuleCheckedState(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {ruleId, checked} = ctx.query as any;
        await this.filterService.setRuleCheckedState(userId, ruleId, checked == 1);
        ctx.body = {
            code: 0
        };
    }

    @Path('saveRule', HttpMethod.POST)
    async saveRule(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.filterService.saveRule(userId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('removeRule', HttpMethod.GET)
    async removeRule(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {ruleId} = ctx.query as any;
        await this.filterService.removeRule(userId, ruleId);
        ctx.body = {
            code: 0
        };
    }
}
