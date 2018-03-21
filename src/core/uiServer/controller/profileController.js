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
        router.get('/profile/resetUserId', async (ctx,next) =>{
            let userId = ctx.query.userId;
            if (!userId) {
                userId = ctx.request.ip;
            }
            ctx.cookies.set('userId', userId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            ctx.body = {
                code: 0,
                data: {
                    userId
                }
            };
        });

    }

};