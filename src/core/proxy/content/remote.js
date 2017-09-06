import axios from "axios";
import HttpProxy from "http-proxy";
import Repository from "../repository";
import {defaultHttpAgent, defaultHttpsAgent} from "../../utils/agent";
/**
 * 请求连接获取返回结果
 */

let remote;
export default class Remote {
    static getRemote() {
        if (!remote) {
            remote = new Remote();
        }
        return remote;
    }

    constructor() {
        let timeout = Repository.getConfigureRepository().getRequestTimeoutTime();
        this.log = Repository.getLogRepository();
        this.proxy = HttpProxy.createProxyServer({
            proxyTimeout: timeout,
            secure: false // http-proxy api  在request的option里设置 rejectUnauthorized = false
        });

        this._registHandleForHttpProxy(this.proxy);
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({req, res, protocol, hostname, path, port, headers}) {
        let isHttps = protocol.indexOf('https') > -1;
        this.proxy.web(req, res, {
            target: {
                protocol,
                hostname,
                path,
                port
            },
            headers,
            ignorePath: true,
            agent: isHttps ? defaultHttpsAgent : defaultHttpAgent
        });
        return Promise.resolve(true);
    }

    /**
     * 将请求远程的响应内容
     */
    cache({req, res, targetUrl, headers, toClientResponse}) {
        // 设置超时时间，节约socket资源
        return Promise.resolve().then(() => {
            return axios({
                method: req.method,
                url: targetUrl,
                headers: headers,
                maxRedirects: 0,
                responseType: 'text',
                data: req
            });
        }).then(response => {
            toClientResponse.hasContent = true;
            toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
            toClientResponse.body = response.data;
        });
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
        proxy.on('error', function (err, req, res, url, source) {
            this.log.error(req.urlObj.id + ' ' + source + ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' error');
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
            this.log.error(req.urlObj.id + ' ' + source + ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' econnreset');
            if (res.headersSent) return;
            res.statusCode = 500;
            res.setHeader('Content-Length', 0);
            res.setHeader('Code', err.code);
            //  res.setHeader('Reason', err.message);
            res.end();
        });
    }
}