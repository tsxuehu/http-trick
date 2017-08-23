/**
 * Created by tsxuehu on 17/3/31.
 */
// 向客户端返回置顶内容
var _ = require('lodash');

module.exports = function ({res, statusCode, headers, content, logKey}) {
    res.statusCode = statusCode || 200;
    var buffer = Buffer.from(content, 'utf-8');

    res.setHeader(logKey || 'fe-proxy-action', 'specific content');
    headers['Content-Length'] = buffer.length;
    headers['Access-Control-Allow-Origin'] = '*';
    _.forEach(headers, function (value, key) {
        res.setHeader(key, value);
    });


    res.end(buffer);
};