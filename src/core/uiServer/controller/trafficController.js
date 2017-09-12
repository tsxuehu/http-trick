import Repository from "../../repository";

export default class TrafficController {
    constructor() {
        this.httpTrafficRepository = Repository.getHttpTrafficRepository();
    }

    regist(router) {
        router.get('/traffic/getResponseBody', async (ctx, next) => {
            let userId = ctx.userId;
            let id = ctx.query.id;
            let content = await this.httpTrafficRepository.getResponseBody(userId, id);
            this.body = content;
        });

        router.get('/traffic/getRequestBody', async (ctx, next) => {
            let userId = ctx.userId;
            let id = ctx.query.id;
            let content = await this.httpTrafficRepository.getRequestBody(userId, id);
            this.body = content;
        });
    }
}