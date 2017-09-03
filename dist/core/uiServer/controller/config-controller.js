'use strict';

/**
 * Created by tsxuehu on 4/11/17.
 */
var fs = require('fs');
var path = require('path');
var dc = require('../../datacenter');
var _ = require('lodash');
exports.regist = function (router) {
    router.get('/conf/getfile', function* (next) {
        this.body = {
            code: 0,
            data: dc.getConf()
        };
    });
    router.post('/conf/savefile', function* (next) {
        dc.setConf(this.request.body);
        this.body = {
            code: 0
        };
    });
    router.post('/conf/setRuleState', function* (next) {
        if (this.query.rulestate) {
            dc.enableRule();
        } else {
            dc.disableRule();
        }
        this.body = {
            code: 0
        };
    });
    router.get('/rootCA.crt', function* (next) {
        this.body = dc.getRootCACertPem();
        this.set('Content-disposition', 'attachment;filename=zproxy.crt');
    });
};