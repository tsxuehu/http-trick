/**
 * 通过socketio向外部发送信息
 */
var uiserver = require('../uiserver');
var dc = require('../datacenter');
var url = require('url');
var qs = require('querystring');
var fs = require('fs')
var _ = require('lodash');
var path = require('path');
var rimraf = require('rimraf');
var fileUtil = require('../utils/file');
// 存放请求文件的陆慕
var tempDir = path.join(fileUtil.getUserHomeConfDir(), 'tmp');
// 启动的时候先清空请求记录目录
rimraf.sync(tempDir);
fs.mkdirSync(tempDir);

var queue = [];

// 定时将监控数据发送给页面
setInterval(function () {
    if (queue.length) {
        // 合并提高性能
        var rsReq = {
            type: 'req',
            rows: []
        };
        var rsRes = {
            type: 'res',
            rows: []
        };
        _.each(queue, function (item) {
            if (item.type == 'req') {
                rsReq.rows = rsReq.rows.concat(item.rows);
            } else if (item.type == 'res') {
                rsRes.rows = rsRes.rows.concat(item.rows);
            }
        });
        var rs = [rsReq, rsRes];
        // console.log(rs);
        uiserver.sentToClientRequest(rs);
        // socket.emit('proxy', queue);
        queue = [];
    }
}, 2500);
// 接受到请求
exports.request = function (id, req) {
    if (!dc.hasHttpTraficMonitor()) return;

    var host = req.headers.host;
    var protocol = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http";
    var fullUrl = protocol === "http" ? req.url : (protocol + '://' + host + req.url);
    var urlObject = url.parse(fullUrl);

    var sid = 1 + '_' + id;
    queue.push({
        type: 'req',
        rows: [{
            id: sid,
            idx: id,
            result: '-', // 状态码
            protocol: urlObject.protocol && urlObject.protocol.replace(':', '').toUpperCase(),
            host: req.headers.host,
            url: req.url,
            path: urlObject.path,
            pathname: urlObject.pathname,
            req: {
                method: req.method,
                httpVersion: req.httpVersion
            },
            method: req.method,
            httpVersion: req.httpVersion,
            reqHeaders: req.headers,
            reqTime: +new Date()
        }]
    });
};
// 请求响应数据
exports.response = function (id, req, res, body) {
    if (!dc.hasHttpTraficMonitor()) return;
    var expires = res.getHeader('expires');
    var sid = 1 + '_' + id;
    // console.log(res);
    var row = {
        id: sid,
        idx: id,
        result: res.statusCode,
        body: res.getHeader('content-length') || (body && body.length) || 0,
        caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + res.getHeader('expires') : ''),
        contentType: res.getHeader('content-type') || '',
        resHeaders: res._headers,
        resTime: +new Date()
    };
    queue.push({
        type: 'res',
        rows: [row]
    });
    var bodyPath = path.join(tempDir, id + '_res_body');
    fs.writeFile(bodyPath, body, 'binary', function (err) {
        if (err) throw err;
    });

};
// 请求body
exports.reqBody = function (id, req, res, body) {
    if (!dc.hasHttpTraficMonitor()) return;
    // only support x-www-form-urlencoded post body
    //  if ((req.headers['content-type'] || '').indexOf('application/x-www-form-urlencoded') >= 0) {

    var sid = 1 + '_' + id;
    queue.push({
        type: 'res',
        rows: [{
            id: sid,
            idx: id,
            // escape to fix not standard urlencoded data
            reqBody: body
        }]
    });
    // 将body写文件
    var bodyPath = path.join(tempDir, id + '_req_body');
    fs.writeFile(bodyPath, body, 'binary', function (err) {
        if (err) throw err;
    });
};
