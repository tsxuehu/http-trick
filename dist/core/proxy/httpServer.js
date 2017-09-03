"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _httpHandle = require("./handle/httpHandle");

var _httpHandle2 = _interopRequireDefault(_httpHandle);

var _connectHandle = require("./handle/connectHandle");

var _connectHandle2 = _interopRequireDefault(_connectHandle);

var _wsHandle = require("./handle/wsHandle");

var _wsHandle2 = _interopRequireDefault(_wsHandle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 1、接受浏览器发出的connect请求（ws、wss、https）
 * 2、转发http请求
 * 3、转发 ws请求
 */
/**
 * Created by tsxuehu on 8/22/17.
 */

class HttpServer {
    constructor(httpPort, httpsPort) {
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
    }

    start() {
        //creat proxy server
        this.httpProxyServer = _http2.default.createServer(_httpHandle2.default.getHttpHandle().handle);
        // handle CONNECT request for https over http
        this.httpProxyServer.on('connect', _connectHandle2.default.getHandle(this.httpPort, this.httpsPort).handle);
        // websocket 请求处理
        this.httpProxyServer.on('upgrade', _wsHandle2.default.getWsHandle().handle);
        //start proxy server 捕获端口冲突

        this.httpProxyServer.on('error', function (err) {
            console.log(err);
            process.exit(0);
        });

        this.httpProxyServer.listen(httpProxyPort, "0.0.0.0");
    }
}
exports.default = HttpServer;