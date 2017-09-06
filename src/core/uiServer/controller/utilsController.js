import Repository from "../../repository";
import * as gitlab from "../../utils/gitlab"
export default class TrafficController {
    constructor() {
        this.configRepository = Repository.getConfigureRepository();
    }

    regist(router) {
        router.get('/utils/getGitlabFile', async (ctx, next) => {
            let userId = ctx.userId;
            let url = ctx.query.url;
            let gitlabToken = await this.configRepository.getGitlabTokenByUserId(userId);
            let response = await gitlab.getContent(url, gitlabToken);
            this.body = {
                headers: response.headers,
                data: response.data
            };
        });
    }
}