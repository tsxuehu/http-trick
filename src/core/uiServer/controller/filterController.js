/**
 * Created by tsxuehu on 4/11/17.
 */
import Repository from "../../repository";
export default class ConfigController {
    constructor() {
        this.filterRepository = Repository.getFilterRepository();

    }

    regist(router) {
        router.post('/filter/savefilters', async (ctx, next) => {
            let userId = ctx.userId;
            await this.filterRepository.save(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });
    }

}