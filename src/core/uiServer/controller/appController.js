/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../service");
let instance;
module.exports = class FilterController {
    static getInstance() {
        if (!instance) {
            instance = new FilterController();
        }
        return instance;
    }
    constructor() {
        this.appInfoService = ServiceRegistry.getAppInfoService();

    }

    regist(router) {
        router.get('/app/get-info', async (ctx, next) => {
            let appInfo = this.appInfoService.getAppInfo();
            ctx.body = {
                code: 0,
                data: appInfo
            };
        });
    }

}
