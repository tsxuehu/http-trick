/**
 * Created by tsxuehu on 4/11/17.
 */
import Repository from "../../repository";
export default class ConfigController {
    constructor() {
        this.confService = Repository.getConfigureRepository();

    }

    regist(router) {
        router.post('/conf/savefile', (ctx, next) => {
            let userId = ctx.userId;
            this.confService.setConf(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });

        router.post('/conf/setRuleState', async (ctx, next) => {
            let userId = ctx.userId;
            await this.confService.setEnableRule(userId, !!ctx.query.rulestate);
            ctx.body = {
                code: 0
            };
        });

    }

}