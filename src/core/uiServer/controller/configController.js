/**
 * Created by tsxuehu on 4/11/17.
 */
import Repository from "../../repository";
export default class ConfigController {
    constructor() {
        this.confRepository = Repository.getConfigureRepository();
        this.rootCertRepository = Repository.getRootCertRepository();
    }

    regist(router) {

        router.post('/conf/savefile', (ctx, next) => {
            let userId = ctx.userId;
            this.confRepository.setConf(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });

        router.post('/conf/setRuleState', (ctx, next) => {
            let userId = ctx.userId;
            if (ctx.query.rulestate) {
                this.confRepository.enableRule(userId);
            } else {
                this.confRepository.disableRule(userId);
            }
            ctx.body = {
                code: 0
            };
        });
        /**
         * 下载证书
         */
        router.get('/rootCA.crt', async (ctx, next) => {
            let userId = ctx.userId;
            ctx.body = await this.rootCertRepository.getRootCACertPem(userId);
            ctx.response.header['Content-disposition'] = 'attachment;filename=zproxy.crt';
        });
    }

}