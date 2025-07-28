import {Controller, Path, Resource} from "@spring4js/container-node";
import {HttpMethod} from "@spring4js/container-node";
import AppInfoService from "service/AppInfoService";
import {Context, Next} from "koa";
import ConfigureService from "service/manage/ConfigureService";

@Controller("/configure")
export default class ConfigController {
    @Resource()
    private configureService: ConfigureService

    @Path('savefile', HttpMethod.POST)
    async savefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.configureService.setConfigure(userId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }
}
