'use strict';

/**
 * Created by tsxuehu on 4/11/17.
 */
var fs = require('fs');
var path = require('path');
var dc = require('../../datacenter');
var _ = require('lodash');
var gitlab = require('../../utils/gitlab');
exports.regist = function (router) {
    //{
    //    name:name,
    //    description:description
    //}
    router.post('/rule/create', function* (next) {
        var result = dc.createRuleFile(this.request.body.name, this.request.body.description);
        this.body = {
            code: result ? 0 : 1,
            msg: result ? '' : '文件已存在'
        };
    });
    // /rule/filelist
    router.get('/rule/filelist', function* (next) {
        this.body = {
            code: 0,
            list: dc.getRuleFileList()
        };
    });
    // /rule/deletefile?name=${name}
    router.get('/rule/deletefile', function* (next) {
        dc.deleteRuleFile(this.query.name);
        this.body = {
            code: 0
        };
    });
    // /rule/setfilecheckstatus?name=${name}&checked=${checked?1:0}
    router.get('/rule/setfilecheckstatus', function* (next) {
        dc.setRuleFilecheckStatus(this.query.name, this.query.checked == 1 ? true : false);
        this.body = {
            code: 0
        };
    });
    // /rule/getfile?name=${name}
    router.get('/rule/getfile', function* (next) {
        this.body = {
            code: 0,
            data: dc.getRuleFile(this.query.name)
        };
    });
    // /rule/savefile?name=${name} ,content
    router.post('/rule/savefile', function* (next) {
        dc.saveRuleFile(this.query.name, this.request.body);
        this.body = {
            code: 0
        };
    });

    // 导出规则文件
    // /rule/download?name=${name}
    router.get('/rule/download', function* (next) {
        var name = this.query.name;
        var content = dc.getRuleFile(name);
        this.set('Content-disposition', 'attachment;filename=' + name + '.json');
        this.body = content;
    });

    // /rule/test
    router.post('/rule/test', function* (next) {
        /*
         url: '',// 请求url
         match: '',// url匹配规则
         targetTpl: '',// 路径模板， 会用urlReg的匹配结果来替换targetTpl $1 $2
         matchRlt: '',// url匹配结果
         targetRlt: ''// 路径匹配结果
         msg: '' // 处理消息
         */

        var match = this.request.body.match;
        var url = this.request.body.url;
        var matchRlt = '不匹配';
        if (match && (url.indexOf(match) >= 0 || new RegExp(match).test(url))) {
            matchRlt = 'url匹配通过';
        }

        var targetTpl = this.request.body.targetTpl;
        var targetRlt = '----';
        var msg = '----';
        if (match && targetTpl) {

            var matchList = url.match(new RegExp(match));
            _.forEach(matchList, function (value, index) {
                var reg = new RegExp('\\$' + index, 'g');
                targetTpl = targetTpl.replace(reg, value);
            });
            targetRlt = targetTpl;
            try {
                targetRlt = dc.resolvePath(targetRlt);
            } catch (e) {
                msg = e.toString();
            }
        }

        // 测试规则
        this.body = {
            code: 0,
            data: {
                matchRlt: matchRlt,
                targetRlt: targetRlt,
                msg: msg
            }
        };
    });

    router.get('/rule/getremoteFile', function* (next) {
        var url = this.query.url;
        var response = yield gitlab.getContent(url, dc.getGitlabToken());
        this.body = {
            headers: response.headers,
            data: response.data
        };
    });
};