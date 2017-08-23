var fs = require('fs');
var path = require('path');
var router = require('koa-router')();
var dc = require('../datacenter');


var saveResponseDirPath = dc.getSaveResponseDirPath();

/**
 * 读取请求的body
 */
router.get('/res/get', function*(next) {
    var id = this.query.idx;
    var filepath = path.join(saveResponseDirPath, id + '_res_body');
    fs.existsSync(filepath) && (this.body = fs.createReadStream(filepath));
});

require('./controller/config-controller').regist(router);
require('./controller/data-controller').regist(router);
require('./controller/host-controller').regist(router);
require('./controller/rule-controller').regist(router);


module.exports = router.routes();