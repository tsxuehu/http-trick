/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../service");
module.exports = class ConfigController {
    constructor() {
        this.confService = ServiceRegistry.getConfigureService();

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