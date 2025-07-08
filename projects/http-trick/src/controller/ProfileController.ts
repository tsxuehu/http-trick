import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import AppInfoService from "service/AppInfoService";
import {Context, Next} from "koa";
import ProfileService from "service/manage/ProfileService";

@Controller('/profile/')
export default class ProfileController {
    @Resource() private appInfoService: AppInfoService
    @Resource() private profileService: ProfileService

    @Path('savefile', HttpMethod.POST)
    async savefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.profileService.setProfile(userId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('setRuleState', HttpMethod.POST)
    async setRuleState(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.profileService.setEnableRule(userId, !!ctx.query.rulestate);
        ctx.body = {
            code: 0
        };
    }

    @Path('setHostState', HttpMethod.POST)
    async setHostState(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.profileService.setEnableHost(userId, !!ctx.query.hoststate);
        ctx.body = {
            code: 0
        };
    }

    @Path('setFilterState', HttpMethod.POST)
    async setFilterState(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.profileService.setEnableFilter(userId, !!ctx.query.filterstate);
        ctx.body = {
            code: 0
        };
    }

    @Path('getUserId', HttpMethod.GET)
    async getUserId(ctx: Context, next: Next) {
        let userId = ctx.userId;
        ctx.body = {
            code: 0,
            data: {
                userId
            }
        };
    }

    @Path('getUserInfo', HttpMethod.GET)
    async getUserInfo(ctx: Context, next: Next) {
        // 用户id
        let userId = ctx.userId;
        let ip: string = ctx.request.headers['x-forwarded-for'] as string;
        if (!ip) {
            ip = ctx.request.socket.remoteAddress;
            // ip = socketIp.getRemoteIp(ctx.request.socket);
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
    }

    @Path('setUserId', HttpMethod.GET)
    async setUserId(ctx: Context, next: Next) {
        let userId: string = ctx.query.userId as string;

        let ip: string = ctx.ip;
        if (ip.substring(0, 7) == "::ffff:") {
            ip = ip.substring(7)
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
    }

    @Path(':userId/proxy.pac', HttpMethod.GET)
    async proxyPac(ctx: Context, next: Next) {
        let {userId} = ctx.params;
        ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig');
        ctx.set('Cache-Control', 'no-cache');
        ctx.set('Server', this.appInfoService.getAppName());
        ctx.set('Connection', 'Close');
        let proxyIp = ctx.query['proxy-ip'] as string;
        ctx.body = this.profileService.generateProxyPacFile(userId, proxyIp);
    }

    @Path('device/bind', HttpMethod.GET)
    async deviceBind(ctx: Context, next: Next) {
        let userId = ctx.query.userId as string;
        let deviceId = ctx.query.deviceId as string;
        if (!deviceId) { // 没传设备id，则将设备的ip作为设备id
            let ip = ctx.request.headers['x-forwarded-for'] as string;
            if (!ip) {
                ip = ctx.request.socket.remoteAddress;
                // ip = socketIp.getRemoteIp(ctx.request.socket);
            }
            deviceId = ip;
        }
        await this.profileService.bindDevice(userId, deviceId);
        ctx.body = {
            code: 0,
            msg: `绑定成功: binded userId: ${userId}; deviceId: ${deviceId}`
        };
    }

    @Path('device/unbind', HttpMethod.GET)
    async deviceUnbind(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
        await this.profileService.unbindDevice(deviceId);
        ctx.body = {
            code: 0,
            msg: '解绑成功'
        };
    }

    @Path('device/externalProxy', HttpMethod.POST)
    async setDeviceExternalProxy(ctx: Context, next: Next) {
        let request = ctx.request.body;
        let deviceId = request.deviceId;
        await this.profileService.setDeviceProxyInfo(deviceId, request);
        ctx.body = {
            code: 0,
            msg: '设置成功'
        };
    }

    @Path('device/externalProxy', HttpMethod.GET)
    async getDeviceExternalProxy(ctx: Context, next: Next) {
        let deviceId = ctx.query.deviceId as string;
        let info = this.profileService.getDeviceProxyInfo(deviceId);
        ctx.body = {
            code: 0,
            data: info
        };
    }

    @Path('device/setName', HttpMethod.GET)
    async deviceSetName(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
        let name = ctx.query.name as string;
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
    }

    @Path('device/usehost', HttpMethod.GET)
    async deviceUsehost(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
        let hostname = ctx.query.hostname as string;
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
    }

    @Path('device/enableMonitor', HttpMethod.GET)
    async deviceEnableMonitor(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
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
    }

    @Path('deviceDisableMonitor', HttpMethod.GET)
    async deviceDisableMonitor(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
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
    }
}
