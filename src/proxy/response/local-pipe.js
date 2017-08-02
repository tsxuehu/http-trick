/**
 * Created by tsxuehu on 17/3/31.
 */
// 读取本地文件返回给客户端

var mime = require('mime');
var fs = require('fs');
var notify = require('../../notify');
var dc = require('../../datacenter');

var errorRes = require('./error');
module.exports = function ({req, res, path, logKey, contentType}) {

    contentType = contentType || mime.lookup(path);
    // 本地文件
    fs.stat(path, function (err, stat) {
        if (err || !stat.isFile()) {
            errorRes(req, res, 404, 'can not read file' + path);
            return;
        }
        res.statusCode = 200;
        // 增加跨域头部
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', contentType + ';charset=utf-8');
        res.setHeader(logKey || 'fe-proxy-action', encodeURI(path));
        fs.createReadStream(path).pipe(res);
    });
    return Promise.resolve(true);
};
