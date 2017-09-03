"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _httpProxy = require("http-proxy");

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _repository = require("../repository");

var _repository2 = _interopRequireDefault(_repository);

var _log = require("../utils/log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultHttpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 5
});

var defaultHttpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 5
});
let proxy;
class HttpProxy {
    static getHttpProxy() {
        if (!proxy) {
            proxy = new HttpProxy();
        }
        return proxy;
    }

    constructor() {
        let timeout = _repository2.default.getConfigureRepository().getRequestTimeoutTime();
        this.log = _log2.default.getLog();
        this.proxy = _httpProxy2.default.createProxyServer({
            proxyTimeout: timeout,
            secure: false // http-proxy api  在request的option里设置 rejectUnauthorized = false
        });
        this._registHandleForHttpProxy(proxy);
        this._registHandleForWSProxy(proxy);
    }

    /**
     * 代理http请求
     * @param req
     * @param res
     * @param options
     */
    web(req, res, options) {
        let isHttps = urlObj.protocol.indexOf('https') > -1;
        this.proxy.web(req, res, Object.assign({ agent: isHttps ? defaultHttpsAgent : defaultHttpAgent }, options));
    }

    /**
     * 代理web socket请求
     * @param req
     * @param socket
     * @param head
     * @param options
     */
    ws(req, socket, head, options) {
        this.proxy.ws(req, socket, head, options);
    }

    /**
     * 为http proxy注册事件响应函数
     */
    _registHandleForHttpProxy(proxy) {
        // 准备处理转发请求的事件
        proxy.on('start', function (req, res, url) {});

        // 代理和远程服务器简历socket链接
        proxy.on('proxyReq', function (proxyReq, req, res, options) {});

        // 远程服务器开始有响应事件
        proxy.on('proxyRes', function (proxyRes, req, res) {});

        // 远程服务器响应结束
        proxy.on('end', function (req, res, proxyRes) {});

        //  req.on('error', proxyError);
        //  proxyReq.on('error', proxyError);
        // 一般性异常，  req和 httpclient抛出的异常
        // 异常时 打印vm的运行状态
        proxy.on('error', function (err, req, res, url, source) {
            this.log.getRequestLog().error(req.urlObj.id + ' ' + source + ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' error');
            if (res.headersSent) return;
            res.statusCode = 500;
            res.setHeader('Content-Length', 0);
            res.setHeader('Code', err.code);
            //  res.setHeader('Reason', err.message);
            res.end();
        });

        //  req.on('error', proxyError);
        //  proxyReq.on('error', proxyError);
        //  特殊异常： req.socket.destroyed && err.code === 'ECONNRESET'
        proxy.on('econnreset', function (err, req, res, url, source) {
            requestLog.error(req.urlObj.id + ' ' + source + ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' econnreset');
            if (res.headersSent) return;
            res.statusCode = 500;
            res.setHeader('Content-Length', 0);
            res.setHeader('Code', err.code);
            //  res.setHeader('Reason', err.message);
            res.end();
        });
    }

    _registHandleForWSProxy(proxy) {
        proxy.on('proxyReqWs', function (proxyReq, req, socket, options, head) {});
        proxy.on('open', function (proxySocket) {});
        proxy.on('close', function (proxyRes, proxySocket, proxyHead) {});
        proxy.on('error', function (err, req, socket) {
            this.log.getRequestLog().error(err);
        });
    }
}
exports.default = HttpProxy;