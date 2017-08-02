/**
 * Created by tsxuehu on 4/11/17.
 */

var fs = require('fs');
var path = require('path');
var dc = require('../../datacenter');
var _ = require('lodash');
exports.regist = function (router) {

    /**
     * 数据文件相关api
     */
    router.get('/data/getdatalist', function*(next) {
        this.body = {
            code: 0,
            data: dc.getDataList()
        };
    });

    router.post('/data/savedatalist', function*(next) {
        dc.saveDataList(this.request.body);
        this.body = {
            code: 0
        };
    });


// 读取数据文件
    var cofs = require('co-fs');
    router.get('/data/getdatafile', function*(next) {
        var datafilePath = dc.getDataFilePath(this.query.id);
        var content = yield cofs.readFile(datafilePath);
        this.body = {
            code: 0,
            data: content.toString('utf8')
        };
    });
// 保存数据文件
    router.post('/data/savedatafile', function*(next) {
        dc.saveDataFileContent(this.query.id, this.request.body.fields.content);
        this.body = {
            code: 0
        };
    });

    router.post('/data/savedatafromtraffic', function*(next) {
        dc.saveDataEntryFromTraffic(this.request.body.id, this.request.body.name,
            this.request.body.contenttype, this.request.body.reqid);
        this.body = {
            code: 0
        };
    });
};