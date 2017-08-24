/**
 * Created by tsxuehu on 8/23/17.
 */

// 读取本地文件返回给客户端

var mime = require('mime');
var fs = require('fs');
var notify = require('../../notify');
export default class Local {
    static getLocal() {

    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({req, res, path, logKey, contentType}) {

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
    }

    /**
     * 将请求远程的响应内容
     */
    cache({req, res, path, logKey, contentType, toSendResponse}) {
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
    }
}