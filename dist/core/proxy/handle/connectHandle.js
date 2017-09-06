"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var net = require("net");
var dc = require("../../datacenter");
var log = require('../../utils/log').getConnectLog();

let connectHandle = null;
// https ws wss 都会发送connect请求
// 代理服务器的目的只要抓取http https请求
// 折中方案：抓取所有的http请求、端口号为443的https请求
class ConnectHandle {
    static getHandle(httpProxyPort, httpsProxyPort) {
        if (!connectHandle) {
            connectHandle = new ConnectHandle(httpProxyPort, httpsProxyPort);
        }
        return connectHandle;
    }

    constructor(httpProxyPort, httpsProxyPort) {
        this.httpProxyPort = httpProxyPort;
        this.httpsProxyPort = httpsProxyPort;
    }

    handle(req, socket, head) {
        var proxyHost = "127.0.0.1";
        var proxyPort;

        // connect请求时 如何判断连到的目标机器是不是https协议？ 因为ws协议也会发送connect请求
        var targetPort = req.url.split(":")[1];
        if (targetPort == 443) {
            proxyPort = this.httpsProxyPort;
        } else {
            // 非443则放行,连到http服务器上
            proxyPort = this.httpProxyPort;
        }

        // 和远程建立链接 并告诉客户端
        var conn = net.connect(proxyPort, proxyHost, function () {
            socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8', function () {
                conn.pipe(socket);
                socket.pipe(conn);
            });
        });

        conn.on("error", function (e) {
            log.error("ws err when connect to + " + proxyHost + " : " + proxyPort);
            log.error(e);
        });
    }
}
exports.default = ConnectHandle;