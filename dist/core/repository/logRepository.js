"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _appInfo = require("../../appInfo");

var appInfo = _interopRequireWildcard(_appInfo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 启动的时候先清空请求记录目录
/**
 * Created by tsxuehu on 8/3/17.
 */
_rimraf2.default.sync(appInfo.tempDir);
_fs2.default.mkdirSync(appInfo.tempDir);

class logRepository {

    constructor() {
        this.cache = {};
        // 创建定时任务，推送日志记录
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
    }

    request({ clientIp, id, req, res, urlObj }) {

        let { protocol, host, pathname, port } = urlObj;

        let queue = this.cache[clientIp] || [];
        queue.push({
            id: id,
            result: '-', // 状态码
            protocol: protocol.toUpperCase(),
            host: host,
            url: req.url,
            port,
            path: _path2.default,
            pathname: pathname,
            method: req.method,
            httpVersion: req.httpVersion,
            reqHeaders: req.headers,
            reqTime: +new Date()
        });

        this.cache[clientIp] = queue;
    }

    reqBody({ clientIp, id, req, res, body }) {
        // 将body写文件
        let bodyPath = _path2.default.join(appInfo.tempDir, id + '_req_body');
        _fs2.default.writeFile(bodyPath, body, 'binary', function (err) {
            if (err) throw err;
        });
    }

    response({ clientIp, id, req, res, responseContent }) {

        let queue = this.cache[clientIp] || [];

        let expires = res.getHeader('expires');
        queue.push({
            id: id,
            result: res.statusCode,
            body: res.getHeader('content-length') || body && body.length || 0,
            caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + expires : ''),
            contentType: res.getHeader('content-type') || '',
            resHeaders: res._headers,
            resTime: +new Date()
        });

        this.cache[clientIp] = queue;

        let bodyPath = _path2.default.join(appInfo.tempDir, id + '_res_body');
        _fs2.default.writeFile(bodyPath, responseContent, 'binary', function (err) {
            if (err) throw err;
        });
    }
}
exports.default = logRepository;