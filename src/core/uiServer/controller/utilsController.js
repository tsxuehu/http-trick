import Repository from "../../repository";
import * as gitlab from "../../utils/gitlab"
export default class TrafficController {
    constructor() {
        this.appInfoRepository = Repository.getAppInfoRepository();
        this.rootCertRepository = Repository.getCertRepository();
    }

    regist(router) {
        router.get('/utils/getGitlabFile', async (ctx, next) => {
            let userId = ctx.userId;
            let url = ctx.query.url;
            let gitlabToken = await this.appInfoRepository.getGitlabToken();
            let response = await gitlab.getContent(url, gitlabToken);
            this.body = {
                headers: response.headers,
                data: response.data
            };
        });

        /**
         * 下载证书
         */
        router.get('/utils/rootCA.crt', async (ctx, next) => {
            let userId = ctx.userId;
            ctx.body = await this.rootCertRepository.getRootCACertPem(userId);
            ctx.response.header['Content-disposition'] = 'attachment;filename=zproxy.crt';
        });
    }
}