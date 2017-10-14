import Repository from "../../repository";
import * as gitlab from "../../utils/gitlab";
export default class TrafficController {
    constructor() {
        this.appInfoService = Repository.getAppInfoRepository();
        this.rootCertService = Repository.getCertRepository();
    }

    regist(router) {
        // 下载gitlab 文件
        router.get('/utils/getGitlabFile', async (ctx, next) => {
            let userId = ctx.userId;
            let url = ctx.query.url;
            let gitlabToken = await this.appInfoService.getGitlabToken();
            let response = await gitlab.getContent(url, gitlabToken);
            this.body = {
                headers: response.headers,
                data: response.data
            };
        });

        // 下载证书
        router.get('/utils/rootCA.crt', async (ctx, next) => {
            let userId = ctx.userId;
            ctx.body = await this.rootCertService.getRootCACertPem(userId);
            ctx.response.header['Content-disposition'] = 'attachment;filename=zproxy.crt';
        });
    }
}