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
    // 下载远程文件
    router.get('/utils/getRemoteFile', async (ctx, next) => {
      let url = ctx.query.url;
      let response = await axios.get(url);
      ctx.body = {
        code: 0,
        data: response.data
      };
    });

    // 下载证书
    router.get('/utils/rootCA.crt', async (ctx, next) => {
      let userId = ctx.userId;
      ctx.set('Content-disposition', 'attachment;filename=zproxy.crt');
      ctx.body = await this.rootCertService.getRootCACertPem(userId);
    });
    // ios证书
    router.get('/utils/rootCA.mobileconfig', async (ctx, next) => {
      let userId = ctx.userId;
      ctx.set('Content-disposition', 'attachment;filename=zproxy.mobileconfig');

      ctx.body = fs.createReadStream(path.join(this.appInfoService.getAppDir(), 'certificate/zproxy.mobileconfig'));
    });
  }
};
