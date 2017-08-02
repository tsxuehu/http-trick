/**
 * Created by tsxuehu on 17/3/31.
 */
// 读取本地文件返回给客户端

var mime = require('mime');
var fs = require('fs');
var notify = require('../../notify');
var dc = require('../../datacenter');

var errorRes = require('./error');
module.exports = function ({req, res, path, logKey, contentType, toSendResponse}) {
    return new Promise((resolve, reject) => {

        contentType = contentType || mime.lookup(path);

        // 本地文件
        fs.stat(path, function (err, stat) {
            if (err || !stat.isFile()) {
                errorRes(req, res, 404, 'can not read file' + path);
                resolve(true);
                return;
            }
            toSendResponse.hasContent = true;
            toSendResponse.headers['Access-Control-Allow-Origin'] = '*';
            toSendResponse.headers['Content-Length'] = stat.size;
            toSendResponse.headers['Content-Type'] = contentType + ';charset=utf-8';
            toSendResponse.headers[logKey || 'fe-proxy-action'] = encodeURI(path);
            toSendResponse.body = fs.readFileSync(path);
            resolve(false);
        });
    });
};
