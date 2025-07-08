import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import {Context, Next} from "koa";
import HostDataService from "service/manage/HostDataService";
import ProfileService from "service/manage/ProfileService";

@Controller('/host/')
export default class HostController {
    @Resource() private hostDataService: HostDataService
    @Resource() private profileService: ProfileService

    @Path('create', HttpMethod.POST)
    async create(ctx: Context, next: Next) {
        let userId = ctx.userId;

        let hostFileId = await this.hostDataService.createHostFile(userId, ctx.request.body.name
            , ctx.request.body.description);
        ctx.body = {
            code: 0,
            msg: 'ok',
            data: {
                id: hostFileId
            }
        };
    }

    @Path('filelist', HttpMethod.GET)
    async filelist(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let deviceId = ctx.query.deviceId as string;
        if (deviceId) {
            userId = this.profileService.getUserIdBindDevice(deviceId);
        }
        let hostList = this.hostDataService.getHostFileList(userId);
        ctx.body = {
            code: 0,
            list: hostList
        };
    }

    @Path('deletefile', HttpMethod.GET)
    async deletefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        await this.hostDataService.deleteHostFile(userId, id);
        ctx.body = {
            code: 0
        };
    }

    @Path('usefile', HttpMethod.GET)
    async usefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        await this.hostDataService.setUseHost(userId, id);
        ctx.body = {
            code: 0
        };
    }

    @Path('getfile', HttpMethod.GET)
    async getfile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        let hostFile = this.hostDataService.getHostFile(userId, id);
        ctx.body = {
            code: 0,
            data: hostFile
        };
    }

    @Path('file/raw', HttpMethod.GET)
    async getFileRaw(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        ctx.body = this.hostDataService.getHostFile(userId, id);
    }

    @Path('savefile', HttpMethod.POST)
    async savefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        await this.hostDataService.saveHostFile(userId, id, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }
}
