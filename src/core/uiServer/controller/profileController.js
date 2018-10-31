/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../service");
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

        // 绑定设备
        router.get('/profile/device/bind', async (ctx, next) => {
            let userId = ctx.query.userId;
            let deviceId = ctx.query.deviceId;
            if (!deviceId) { // 没传设备id，则将设备的ip作为设备id
                let ip = ctx.ip;
                if (ip.substr(0, 7) == "::ffff:") {
                    deviceId = ip.substr(7)
                }
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
