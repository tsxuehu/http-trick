import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import AppInfoService from "service/AppInfoService";
import {Context, Next} from "koa";

@Controller('/app/')
export default class AppController {
    @Resource() private appInfoService: AppInfoService
    @Path('get-info', HttpMethod.GET)
    async getInfo(ctx: Context, next: Next) {
        let appInfo = this.appInfoService.getAppInfo();
        ctx.body = {
            code: 0,
            data: appInfo
        };
    }
}
