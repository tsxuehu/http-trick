// 读取本地文件返回给客户端

const mime = require("mime");
const fs = require("fs");
const sendErrorToClient = require("../proxy/sendToClient/error");

let local;
module.exports = class Local {
    static getInstance() {
        if (!local) {
            local = new Local();
        }
        return local;
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({ req, res, path, contentType, toClientResponse }) {

        contentType = contentType || mime.lookup(path);
        // 本地文件
        fs.stat(path, function (err, stat) {
            if (err || !stat.isFile()) {
                sendErrorToClient(req, res, 404, 'can not read file ' + path);
                return;
            }
            res.statusCode = 200;
            // 增加跨域头部
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', contentType + ';charset=utf-8');
            fs.createReadStream(path).pipe(res);
        });
        return Promise.resolve(true);
    }

    /**
     * 将请求远程的响应内容
     */
    cache({ req, res, path, contentType, toClientResponse }) {
        return new Promise((resolve, reject) => {

            contentType = contentType || mime.lookup(path);

            // 本地文件
            fs.stat(path, function (err, stat) {
                if (err || !stat.isFile()) {
                    sendErrorToClient(req, res, 404, 'can not read file' + path);
                    resolve(false);
                    return;
                }
                toClientResponse.hasContent = true;
                toClientResponse.headers['Access-Control-Allow-Origin'] = '*';
                toClientResponse.headers['Content-Length'] = stat.size;
                toClientResponse.headers['Content-Type'] = contentType + ';charset=utf-8';
                toClientResponse.body = fs.readFileSync(path);
                resolve(true);
            });
        });
    }
};