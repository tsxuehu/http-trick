import Service from "../../service";

export default class TrafficController {
    constructor() {
        this.httpTrafficService = Service.getHttpTrafficRepository();
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