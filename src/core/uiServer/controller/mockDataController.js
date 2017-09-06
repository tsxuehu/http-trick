/**
 * Created by tsxuehu on 4/11/17.
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
import Repository from "../../repository";
import cofs from 'co-fs';

export default class DataController {
    constructor() {
    }

    regist(router) {
        let _mockDataRepository = Repository.getMockDataRepository();
        /**
         * 数据文件相关api
         */
        router.get('/data/getdatalist', (ctx, next)=> {
            let userId = ctx.userId;
            this.body = {
                code: 0,
                data: _mockDataRepository.getDataList()
            };
        });

        router.post('/data/savedatalist', (ctx, next)=> {
            let userId = ctx.userId;
            _mockDataRepository.saveDataList(this.request.body);
            this.body = {
                code: 0
            };
        });

        // 读取数据文件
        router.get('/data/getdatafile', (ctx, next)=> {
            let userId = ctx.userId;
            var datafilePath = _mockDataRepository.getDataFilePath(this.query.id);
            var content = yield cofs.readFile(datafilePath);
            this.body = {
                code: 0,
                data: content.toString('utf8')
            };
        });
        // 保存数据文件
        router.post('/data/savedatafile', (ctx, next)=> {
            let userId = ctx.userId;
            _mockDataRepository.saveDataFileContent(this.query.id, this.request.body.fields.content);
            this.body = {
                code: 0
            };
        });

        router.post('/data/savedatafromtraffic', (ctx, next)=> {
            let userId = ctx.userId;
            _mockDataRepository.saveDataEntryFromTraffic(this.request.body.id, this.request.body.name,
                this.request.body.contenttype, this.request.body.reqid);
            this.body = {
                code: 0
            };
        });
    }
}