"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _httpProxy = require("../../utils/httpProxy");

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _log = require("../../utils/log");

var _log2 = _interopRequireDefault(_log);

var _wsmock = require("../wsmock");

var _wsmock2 = _interopRequireDefault(_wsmock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let wsHandle;
class WsHandle {
    static getWsHandle() {
        if (!wsHandle) {
            wsHandle = new WsHandle();
        }
        return wsHandle;
    }

    constructor() {
        this.log = _log2.default.getLog();
        // 创建httpProxy
        this.proxy = _httpProxy2.default.getHttpProxy();
        this.wsMock = _wsmock2.default.getWsMock();
    }

    // websocket请求转发 ws测试服务器ws://echo.websocket.org/
    handle(req, socket, head) {
        // 分配ws mock终端，没有分配到终端的和远程建立连接，分配到mock终端的和mock终端通信
        var host = req.headers.host.split(':')[0];
        var port = req.headers.host.split(':')[1];
        var path = _url2.default.parse(req.url).path;
        var protocal = !!req.connection.encrypted && !/^http:/.test(req.url) ? "https" : "http";
        var sessionId = this.wsMock.getFreeSession(req.headers.host + path);

        if (sessionId) {
            // 有监控的客户端
            this.wsMock.handleUpgrade(req, socket, head, sessionId, req.headers.host + path);
        } else {
            // 不需要监听ws
            this.proxy.ws(req, socket, head, {
                target: {
                    protocol: protocal,
                    hostname: dc.resolveHost(host),
                    port: port || (protocal == 'http' ? 80 : 443)
                }
            });
        }
    }
}
exports.default = WsHandle;