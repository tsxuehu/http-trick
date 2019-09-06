const ServiceRegistry = require("../../../service");
const gitlab = require("../../../utils/gitlab");
const axios = require('axios');
const path = require('path');
const fs = require('fs');
let instance;
module.exports = class TrafficController {
    static getInstance() {
        if (!instance) {
            instance = new TrafficController();
        }
        return instance;
    }

    constructor() {
        this.appInfoService = ServiceRegistry.getAppInfoService();
        this.rootCertService = ServiceRegistry.getCertificationService();
        this.profileService = ServiceRegistry.getProfileService();
    }

    regist(router) {
        // 下载gitlab 文件
        // 导入远程文件步骤
        // 1、client调用这个接口获取远程文件
        // 2、client保存远程文件
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
            ctx.set('Content-disposition', 'attachment;filename=zproxy.crt');
            ctx.body = await this.rootCertService.getRootCACertPem(userId);
        });

        router.get('/utils/rootCA.mobileconfig', async (ctx, next) => {
            let userId = ctx.userId;
            ctx.set('Content-disposition', 'attachment;filename=zproxy.mobileconfig');

            ctx.body = fs.createReadStream(path.join(this.appInfoService.getAppDir(), 'certificate/zproxy.mobileconfig'));
        });
    }
};
