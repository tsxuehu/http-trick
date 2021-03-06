const ServiceRegistry = require("../../../service");

let instance;
module.exports = class HostController {
  static getInstance() {
    if (!instance) {
      instance = new HostController();
    }
    return instance;
  }

  constructor() {

    this.hostService = ServiceRegistry.getHostService();
    this.profileService = ServiceRegistry.getProfileService();
  }

  regist(router) {

    //{
    //    name:name,
    //    description:description
    //}
    router.post('/host/create', async (ctx, next) => {
      let userId = ctx.userId;

      let hostFileId = await this.hostService.createHostFile(userId, ctx.request.body.name
        , ctx.request.body.description);
      ctx.body = {
        code: 0,
        msg: 'ok',
        data: {
          id: hostFileId
        }
      };
    });
    router.get('/host/filelist', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      if (deviceId) {
        userId = this.profileService.getUserIdBindDevice(deviceId);
      }
      let hostList = await this.hostService.getHostFileList(userId);
      ctx.body = {
        code: 0,
        list: hostList
      };
    });
    // /host/deletefile?name=${name}
    router.get('/host/deletefile', (ctx, next) => {
      let userId = ctx.userId;
      this.hostService.deleteHostFile(userId, ctx.query.id);
      ctx.body = {
        code: 0
      };
    });
    // /host/usefile?name=${name}
    router.get('/host/usefile', async (ctx, next) => {
      let userId = ctx.userId;
      await this.hostService.setUseHost(userId, ctx.query.id);
      ctx.body = {
        code: 0
      };
    });
    // /host/getfile?name=${name}
    router.get('/host/getfile', async (ctx, next) => {
      let userId = ctx.userId;
      let hostFile = await this.hostService.getHostFile(userId, ctx.query.id);
      ctx.body = {
        code: 0,
        data: hostFile
      };
    });

    router.get('/host/file/raw', async (ctx, next) => {
      let userId = ctx.userId;
      let hostFile = await this.hostService.getHostFile(userId, ctx.query.id);
      ctx.body = hostFile;
    });

    // /host/savefile?name=${name} ,content
    router.post('/host/savefile', (ctx, next) => {
      let userId = ctx.userId;
      this.hostService.saveHostFile(userId, ctx.query.id, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });
  }
}
