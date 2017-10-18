const ServiceRegistry = require("../../service");
const gitlab = require("../../utils/gitlab");
module.exports = class TrafficController {
    constructor() {
        this.appInfoService = ServiceRegistry.getAppInfoRepository();
        this.rootCertService = ServiceRegistry.getCertRepository();
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