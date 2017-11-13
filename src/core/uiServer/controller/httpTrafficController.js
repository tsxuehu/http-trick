const ServiceRegistry = require("../../service");

let instance;
module.exports = class TrafficController {
    static getInstance() {
        if (!instance) {
            instance = new TrafficController();
        }
        return instance;
    }
    constructor() {
        this.httpTrafficService = ServiceRegistry.getHttpTrafficService();
    }

    regist(router) {
        // 获取响应body
        router.get('/traffic/getResponseBody', async (ctx, next) => {
            let userId = ctx.userId;
            let id = ctx.query.id;
            let content = await this.httpTrafficService.getResponseBody(userId, id);
            this.body = content;
        });

        // 获取请求body
        router.get('/traffic/getRequestBody', async (ctx, next) => {
            let userId = ctx.userId;
            let id = ctx.query.id;
            let content = await this.httpTrafficService.getRequestBody(userId, id);
            this.body = content;
        });
    }
}