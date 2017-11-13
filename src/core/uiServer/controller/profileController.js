/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../service");
let instance;
module.exports = class ConfigController {
    static getInstance() {
        if (!instance) {
            instance = new ConfigController();
        }
        return instance;
    }
    constructor() {
        this.confService = ServiceRegistry.getProfileService();

    }

    regist(router) {
        router.post('/profile/savefile', (ctx, next) => {
            let userId = ctx.userId;
            this.confService.setConf(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });

        router.post('/profile/setRuleState', async (ctx, next) => {
            let userId = ctx.userId;
            await this.confService.setEnableRule(userId, !!ctx.query.rulestate);
            ctx.body = {
                code: 0
            };
        });

    }

}