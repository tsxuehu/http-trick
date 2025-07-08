import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import {Context, Next} from "koa";
import HttpTrafficService from "service/intercept/HttpTrafficService";

@Controller('/traffic/')
export default class HttpTrafficController {
    @Resource() private httpTrafficService: HttpTrafficService

    @Path('getResponseBody', HttpMethod.GET)
    async getResponseBody(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let id = +(ctx.query.id as string);
        ctx.body = await this.httpTrafficService.getResponseBody(userId, id);
    }

    @Path('getRequestBody', HttpMethod.GET)
    async getRequestBody(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let id = +(ctx.query.id as string);
        ctx.body = await this.httpTrafficService.getRequestBody(userId, id);
    }

    @Path('stopRecord', HttpMethod.GET)
    async stopRecord(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let stopRecord = ctx.query.stop;
        this.httpTrafficService.setStopRecord(userId, stopRecord == 'true');
        ctx.body = {
            code: 0
        };
    }

    @Path('setfilter', HttpMethod.GET)
    async setfilter(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let { path = '', host = '' } = ctx.query as { path?: string, host?: string };
        this.httpTrafficService.setFilter(userId, {path, host});
        ctx.body = {
            code: 0
        };
    }

    @Path('clear', HttpMethod.GET)
    async clear(ctx: Context, next: Next) {
        let userId = ctx.userId;
        this.httpTrafficService.clear(userId);
        ctx.body = {
            code: 0
        };
    }
}
