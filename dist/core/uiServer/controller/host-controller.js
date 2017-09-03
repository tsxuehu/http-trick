'use strict';

/**
 * Created by tsxuehu on 4/11/17.
 */
var fs = require('fs');
var path = require('path');
var dc = require('../../datacenter');
var _ = require('lodash');
exports.regist = function (router) {
    //{
    //    name:name,
    //    description:description
    //}
    router.post('/host/create', function* (next) {
        var result = dc.createHostFile(this.request.body.name, this.request.body.description);
        this.body = {
            code: result ? 0 : 1,
            msg: result ? '' : '文件已存在'
        };
    });
    router.get('/host/filelist', function* (next) {
        this.body = {
            code: 0,
            list: dc.getHostFileList()
        };
    });
    // /host/deletefile?name=${name}
    router.get('/host/deletefile', function* (next) {
        dc.deleteHostFile(this.query.name);
        this.body = {
            code: 0
        };
    });
    // /host/usefile?name=${name}
    router.get('/host/usefile', function* (next) {
        dc.setUseHost(this.query.name);
        this.body = {
            code: 0
        };
    });
    // /host/getfile?name=${name}
    router.get('/host/getfile', function* (next) {
        this.body = {
            code: 0,
            data: dc.getHostFile(this.query.name)
        };
    });
    // /host/savefile?name=${name} ,content
    router.post('/host/savefile', function* (next) {
        dc.saveHostFile(this.query.name, this.request.body);
        this.body = {
            code: 0
        };
    });
};