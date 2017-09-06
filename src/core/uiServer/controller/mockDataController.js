/**
 * Created by tsxuehu on 4/11/17.
 */

import Repository from "../../repository";

export default class DataController {
    constructor() {
        this.mockDataRepository = Repository.getMockDataRepository();
    }

    regist(router) {
        /**
         * 数据文件相关api
         */
        router.get('/data/getdatalist', async (ctx, next) => {
            let userId = ctx.userId;
            let dataList = await this.mockDataRepository.getMockDataList(userId);
            ctx.body = {
                code: 0,
                data: dataList
            };
        });

        router.post('/data/savedatalist', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataRepository.saveMockDataList(userId, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });

        // 读取数据文件
        router.get('/data/getdatafile', async (ctx, next) => {
            let userId = ctx.userId;
            let content = await this.mockDataRepository.getDataFileContent(userId, ctx.query.id);
            ctx.body = {
                code: 0,
                data: content
            };
        });
        // 保存数据文件
        router.post('/data/savedatafile', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataRepository.saveDataFileContent(userId, ctx.query.id, ctx.request.body.fields.content);
            ctx.body = {
                code: 0
            };
        });

        router.post('/data/savedatafromtraffic', (ctx, next) => {
            let userId = ctx.userId;
            this.mockDataRepository.saveDataEntryFromTraffic(userId,
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