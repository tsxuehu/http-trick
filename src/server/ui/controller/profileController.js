/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../../service");
const socketIp = require("../../../utils/socketIp");

let instance;
module.exports = class ConfigController {
  static getInstance() {
    if (!instance) {
      instance = new ConfigController();
    }
    return instance;
  }

  constructor() {
    this.profileService = ServiceRegistry.getProfileService();
    this.appInfoService = ServiceRegistry.getAppInfoService();
  }

  regist(router) {
    router.post('/profile/savefile', async (ctx, next) => {
      let userId = ctx.userId;
      await this.profileService.setProfile(userId, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });

    router.post('/profile/setRuleState', async (ctx, next) => {
      let userId = ctx.userId;
      await this.profileService.setEnableRule(userId, !!ctx.query.rulestate);
      ctx.body = {
        code: 0
      };
    });

    router.post('/profile/setHostState', async (ctx, next) => {
      let userId = ctx.userId;
      await this.profileService.setEnableHost(userId, !!ctx.query.hoststate);
      ctx.body = {
        code: 0
      };
    });

    router.post('/profile/setFilterState', async (ctx, next) => {
      let userId = ctx.userId;
      await this.profileService.setEnableFilter(userId, !!ctx.query.filterstate);
      ctx.body = {
        code: 0
      };
    });

    router.get('/profile/:userId/proxy.pac', async (ctx, next) => {
      let {userId} = ctx.params;
      ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig');
      ctx.set('Cache-Control', 'no-cache');
      ctx.set('Server', this.appInfoService.getAppName());
      ctx.set('Connection', 'Close');
      let proxyIp = ctx.query['proxy-ip'];
      let content = await this.profileService.generateProxyPacFile(userId, proxyIp);
      ctx.body = content;
    });

    // 绑定设备
    router.get('/profile/device/bind', async (ctx, next) => {
      let userId = ctx.query.userId;
      let deviceId = ctx.query.deviceId;
      if (!deviceId) { // 没传设备id，则将设备的ip作为设备id
        let ip = ctx.request.headers['x-forwarded-for'];
        if (!ip) {
          ip = socketIp.getRemoteIp(ctx.request.socket);
        }
        deviceId = ip;
      }
      this.profileService.bindDevice(userId, deviceId);
      ctx.body = {
        code: 0,
        msg: `绑定成功: binded userId: ${userId}; deviceId: ${deviceId}`
      };
    });

    // 解绑设备
    router.get('/profile/device/unbind', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      this.profileService.unbindDevice(deviceId);
      ctx.body = {
        code: 0,
        msg: '解绑成功'
      };
    });

    // 设置额外代理
    router.post('/profile/device/externalProxy', async (ctx, next) => {
      let request = ctx.request.body;
      let deviceId = request.deviceId;

      await this.profileService.setDeviceProxyInfo(deviceId, request);

      ctx.body = {
        code: 0,
        msg: '设置成功'
      };
    });

    router.get('/profile/device/externalProxy', async (ctx, next) => {
      let deviceId = ctx.query.deviceId;

      let info = this.profileService.getDeviceProxyInfo(deviceId);

      ctx.body = {
        code: 0,
        data: info
      };
    });

    router.get('/profile/device/setName', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      let name = ctx.query.name;
      try {
        await this.profileService.setDeviceName(deviceId, name);
        ctx.body = {
          code: 0,
          msg: '解绑成功'
        };
      } catch (e) {
        ctx.body = {
          code: 1,
          msg: e.message
        };
      }

    });

    router.get('/profile/device/disableMonitor', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      try {
        await this.profileService.setDisableMonitor(deviceId, true);
        ctx.body = {
          code: 0,
          msg: `${deviceId}已经解除监控`
        };
      } catch (e) {
        ctx.body = {
          code: 1,
          msg: e.message
        };
      }

    });

    router.get('/profile/device/enableMonitor', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      try {
        await this.profileService.setDisableMonitor(deviceId, false);
        ctx.body = {
          code: 0,
          msg: `${deviceId}已经解除监控`
        };
      } catch (e) {
        ctx.body = {
          code: 1,
          msg: e.message
        };
      }

    });

    router.get('/profile/device/usehost', async (ctx, next) => {
      let userId = ctx.userId;
      let deviceId = ctx.query.deviceId;
      let hostname = ctx.query.hostname;
      try {
        await this.profileService.setDeviceHostFileName(deviceId, hostname);
        ctx.body = {
          code: 0,
          msg: '操作成功'
        };
      } catch (e) {
        ctx.body = {
          code: 1,
          msg: e.message
        };
      }

    });

    // 获取用户id
    router.get('/profile/getUserId', async (ctx, next) => {
      let userId = ctx.userId;
      ctx.body = {
        code: 0,
        data: {
          userId
        }
      };
    });

    router.get('/profile/getUserInfo', async (ctx, next) => {
      // 用户id
      let userId = ctx.userId;
      let ip = ctx.request.headers['x-forwarded-for'];
      if (!ip) {
        ip = socketIp.getRemoteIp(ctx.request.socket);
      }
      if (ip.indexOf(',') > -1) {
        ip = ip.split(',')[0];
      }
      let deviceId = ip;
      // 检查访问设备是否绑定当前用户，若没有则绑定
      let info = this.profileService.getDevice(deviceId);
      if (!info || info.userId != userId) {
        this.profileService.bindDevice(userId, deviceId);
      }

      // 设备id -- 浏览器端访问将设备ip作为设备id
      ctx.body = {
        code: 0,
        data: {
          userId, deviceId, ip
        }
      };
    });

    // 重载用户id
    router.get('/profile/setUserId', async (ctx, next) => {
      let userId = ctx.query.userId;

      let ip = ctx.ip;
      if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
      }

      if (!userId) {
        userId = ip;
      }
      userId = userId.trim();
      ctx.cookies.set('userId', userId, {maxAge: 1000 * 60 * 60 * 24 * 365});
      ctx.body = {
        code: 0,
        data: {
          userId,
          single: this.appInfoService.isSingle()
        }
      };
    });

  }

};
