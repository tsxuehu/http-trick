/**
 * Created by tsxuehu on 4/11/17.
 */
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
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
            if (this.query.rulestate) {
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
        router.get('/rootCA.crt', (ctx, next) => {
            let userId = ctx.userId;
            ctx.body = this.rootCertRepository.getRootCACertPem(userId);
            ctx.set('Content-disposition', 'attachment;filename=zproxy.crt');
        });
    }

}