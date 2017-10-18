/**
 * Created by tsxuehu on 4/11/17.
 */
const Service = require("../../service");
module.exports = class ConfigController {
    constructor() {
        this.filterService = Service.getFilterRepository();

    }

    regist(router) {
        router.post('/filter/savefilters', async (ctx, next) => {
            let userId = ctx.userId;
            await this.filterService.save(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });
    }

}