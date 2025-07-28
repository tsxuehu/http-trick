import {Controller, Path, Resource} from "@spring4js/container-node";
import {HttpMethod} from "@spring4js/container-node";
import AppInfoService from "service/AppInfoService";
import {Context, Next} from "koa";
import MockDataService from "service/manage/MockDataService";
import HttpTrafficService from "service/intercept/HttpTrafficService";

@Controller('/data/')
export default class MockDataController {
    @Resource() private httpTrafficService: HttpTrafficService
    @Resource() private mockDataService: MockDataService
    @Path('getdatalist', HttpMethod.GET)
    async getdatalist(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let dataList = this.mockDataService.getMockDataList(userId);
        ctx.body = {
            code: 0,
            data: dataList
        };
    }

    @Path('removedatafile', HttpMethod.POST)
    async removedatafile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.mockDataService.removeDataFile(userId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('createdatafile', HttpMethod.POST)
    async createdatafile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.mockDataService.createDataFile(userId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('getdatafile', HttpMethod.GET)
    async getdatafile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        let content = await this.mockDataService.getDataFileContent(userId, id);
        ctx.body = {
            code: 0,
            data: content
        };
    }

    @Path('savedatafile', HttpMethod.POST)
    async savedatafile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        const id = ctx.query.id as string;
        await this.mockDataService.saveDataFileContent(userId, id, ctx.request.body.fields.content);
        ctx.body = {
            code: 0
        };
    }

    @Path('savedatafromtraffic', HttpMethod.POST)
    async savedatafromtraffic(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {id, name, contenttype} = ctx.request.body;
        let content = await this.httpTrafficService.getResponseBody(userId, ctx.request.body.reqid);
        let entry = {
            id: id,
            name: name,
            contenttype: contenttype
        };
        await this.mockDataService.createDataFile(userId, entry);
        await this.mockDataService.saveDataFileContent(userId, id, content);

        ctx.body = {
            code: 0
        };
    }
}
