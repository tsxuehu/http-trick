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
        router.get('/profile/device/bind', async (ctx,next) =>{
            let userId = ctx.query.userId;
            let ip = ctx.ip;
            if (ip.substr(0, 7) == "::ffff:") {
                ip = ip.substr(7)
            }
            this.profileService.bindClientIp(userId, ip);
            ctx.body = {
                code: 0,
                msg: `绑定成功: binded userId: ${userId}; ip: ${ip}`
            };
        });

        // 解绑设备
        router.get('/profile/device/unbind', async (ctx,next) =>{
            let userId = ctx.userId;
            let ip = ctx.query.ip;
            this.profileService.unbindClientIp(ip);
            ctx.body = {
                code: 0,
                msg: '解绑成功'
            };
        });

        // 获取用户id
        router.get('/profile/getUserId', async (ctx,next) =>{
            let userId = ctx.userId;
            ctx.body = {
                code: 0,
                data: {
                    userId
                }
            };
        });

        // 重载用户id
        router.get('/profile/setUserId', async (ctx,next) =>{
            let userId = ctx.query.userId;

            let ip = ctx.ip;
            if (ip.substr(0, 7) == "::ffff:") {
                ip = ip.substr(7)
            }

            if (!userId) {
                userId = ip;
            }
            userId = userId.trim();
            this.profileService.bindClientIp(userId, ip);
            ctx.cookies.set('userId', userId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
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