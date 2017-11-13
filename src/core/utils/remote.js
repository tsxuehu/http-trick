const axios = require("axios");
const HttpProxy = require("http-proxy");
const {defaultHttpAgent, defaultHttpsAgent} = require("./agent");
const queryString = require("query-string");
const resovleIp = require("./dns");
const log = require("./log");
/**
 * 从远程服务器上获取响应内容
 */

let remote;

module.exports = class Remote {
    static getInstance() {
        if (!remote) {
            remote = new Remote();
        }
        return remote;
    }

    constructor() {
        this.proxy = HttpProxy.createProxyServer({
            secure: false // http-proxy api  在request的option里设置 rejectUnauthorized = false
        });

        this._registHandleForHttpProxy(this.proxy);
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    async pipe({req, res, protocol, hostname, path, port, headers, timeout}) {
        let isHttps = protocol.indexOf('https') > -1;
        // http.request 解析dns时，偶尔会出错
        let ip = await resovleIp(hostname);
        this.proxy.web(req, res, {
            target: {
                protocol,
                hostname: ip,
                path,
                port
            },
            headers,
            ignorePath: true,
            proxyTimeout: timeout,
            agent: isHttps ? defaultHttpsAgent : defaultHttpAgent
        });
    }

    /**
     * 将请求远程的响应内容
     */
    async cache({req, res, targetUrl, headers, toClientResponse, timeout}) {
        // 设置超时时间，节约socket资源
        let response = await axios({
            method: req.method,
            url: targetUrl,
            headers: headers,
            maxRedirects: 0,
            responseType: 'text',
            data: req
        });
        toClientResponse.hasContent = true;
        toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
        toClientResponse.body = response.data;
    }

    /**
     * 根据RequestContent
     */
    async cacheFromRequestContent({requestContent, toClientResponse, timeout}) {
        let {protocol, host, pathname, port, query} = requestContent;
        let href = `${protocol}//${host}:${port}${pathname}?${queryString.stringify(query)}`;
        let response = await axios({
            method: requestContent.method,
            url: href,
            headers: requestContent.headers,
            maxRedirects: 0,
            responseType: 'text',
            data: requestContent.body
        });
        toClientResponse.hasContent = true;
        toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
        toClientResponse.body = response.data;
        return toClientResponse;
    }

    /**
     * 为http proxy注册事件响应函数
     */
    _registHandleForHttpProxy(proxy) {
        // 准备处理转发请求的事件
        proxy.on('start', function (req, res, url) {

        });

        // 代理和远程服务器简历socket链接
        proxy.on('proxyReq', function (proxyReq, req, res, options) {

        });

        // 远程服务器开始有响应事件
        proxy.on('proxyRes', function (proxyRes, req, res) {

        });

        // 远程服务器响应结束
        proxy.on('end', function (req, res, proxyRes) {

        });

        //  req.on('error', proxyError);
        //  proxyReq.on('error', proxyError);
        // 一般性异常，  req和 httpclient抛出的异常
        // 异常时 打印vm的运行状态
        proxy.on('error', function (err, req, res, url) {
            log.error(err,url);
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
        proxy.on('econnreset', function (err, req, res, url) {
            log.error(err,url);
            if (res.headersSent) return;
            res.statusCode = 500;
            res.setHeader('Content-Length', 0);
            res.setHeader('Code', err.code);
            //  res.setHeader('Reason', err.message);
            res.end();
        });
    }
}