/**
 * Created by tsxuehu on 4/11/17.
 */

var _ = require('lodash');
var gitlab = require('../utils/gitlab');
var dc = require('../datacenter');
var notifier = require('node-notifier');
var path = require('path');
var opn = require('opn');
notifier.on('click', function () {
    var url = 'http://' + dc.getPcIp() + ':' + dc.getRealUiPort() + '/#/rulefilelist';
    opn(url);
});

function sendNotification() {
    var finded = _.find(dc.getRuleFileList(), function (ruleFile) {
        return ruleFile.meta.ETag != ruleFile.meta.remoteETag;
    });
    if (!finded) return;
    notifier.notify({
        title: 'zan-proxy',
        message: '有可更新的规则文件',
        sound: 'Funk',
        wait: true,
        timeout: 5
        // icon: path.join(__dirname, '../../webui/p.png')
    });
}
/**
 * 文件同步
 */
function getRuleFileLastestETag() {
    // 循环里面有异步方法
    _.forEach(dc.getRuleFileList(), function (ruleFile) {
        if (!ruleFile.meta.remote) return;
        gitlab.getEtag(ruleFile.meta.url, dc.getGitlabToken(), function (etag) {
            var content = dc.getRuleFile(ruleFile.name);
            content.meta.remoteETag = etag;
        })
    });
}

exports.start = function () {
    setTimeout(getRuleFileLastestETag, 5 * 1000);
    setTimeout(sendNotification, 10 * 1000);
};

exports.check = function () {
    setTimeout(getRuleFileLastestETag, 2 * 1000);
    setTimeout(sendNotification, 7 * 1000);
};