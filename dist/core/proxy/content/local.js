"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mime = require("mime");

var _mime2 = _interopRequireDefault(_mime);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _error = require("../sendToClient/error");

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let local; // 读取本地文件返回给客户端

class Local {
    static getLocal() {
        if (!local) {
            local = new Local();
        }
        return local;
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({ req, res, path, contentType }) {

        contentType = contentType || _mime2.default.lookup(path);
        // 本地文件
        _fs2.default.stat(path, function (err, stat) {
            if (err || !stat.isFile()) {
                (0, _error2.default)(req, res, 404, 'can not read file ' + path);
                return;
            }
            res.statusCode = 200;
            // 增加跨域头部
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', contentType + ';charset=utf-8');
            _fs2.default.createReadStream(path).pipe(res);
        });
        return Promise.resolve(true);
    }

    /**
     * 将请求远程的响应内容
     */
    cache({ req, res, path, contentType, toClientResponse }) {
        return new Promise((resolve, reject) => {

            contentType = contentType || _mime2.default.lookup(path);

            // 本地文件
            _fs2.default.stat(path, function (err, stat) {
                if (err || !stat.isFile()) {
                    (0, _error2.default)(req, res, 404, 'can not read file' + path);
                    resolve(true);
                    return;
                }
                toClientResponse.hasContent = true;
                toClientResponse.headers['Access-Control-Allow-Origin'] = '*';
                toClientResponse.headers['Content-Length'] = stat.size;
                toClientResponse.headers['Content-Type'] = contentType + ';charset=utf-8';
                toClientResponse.body = _fs2.default.readFileSync(path);
                resolve(false);
            });
        });
    }
}
exports.default = Local;