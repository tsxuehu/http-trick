/**
 * Created by tsxuehu on 4/11/17.
 */

import Service from "../../service";
/**
 * 数据文件相关api
 */
export default class DataController {
    constructor() {
        this.mockDataService = Service.getMockDataRepository();
    }

    regist(router) {

        // 获取mock数据列表
        router.get('/data/getdatalist', async (ctx, next) => {
            let userId = ctx.userId;
            let dataList = await this.mockDataService.getMockDataList(userId);
            ctx.body = {
                code: 0,
                data: dataList
            };
        });
        // 保存数据列表
        router.post('/data/savedatalist', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataService.saveMockDataList(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });

        // 读取数据文件
        router.get('/data/getdatafile', async (ctx, next) => {
            let userId = ctx.userId;
            let content = await this.mockDataService.getDataFileContent(userId, ctx.query.id);
            ctx.body = {
                code: 0,
                data: content
            };
        });
        // 保存数据文件
        router.post('/data/savedatafile', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataService.saveDataFileContent(userId, ctx.query.id, ctx.request.body.fields.content);
            ctx.body = {
                code: 0
            };
        });
        // 从http请求日志中保存 mock 数据
        router.post('/data/savedatafromtraffic', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataService.saveDataEntryFromTraffic(userId,
                ctx.request.body.id,
                ctx.request.body.name,
                ctx.request.body.contenttype,
                ctx.request.body.reqid);
            ctx.body = {
                code: 0
            };
        });
    }
}