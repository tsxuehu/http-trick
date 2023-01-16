const axios = require("axios");
const queryString = require("query-string");
const log = require("./log");
const _ = require("lodash");
const http = require('http');
const https = require('https');
const toClientResponseUtils = require('./toClientResponseUtils');
const requestResponseUtils = require('./requestResponseUtils');
const SocksProxyAgent = require('./socksAgent');
const StreamMonitor = require('./stream-monitor');
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
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    async pipe({
                   req, res, recordResponse,
                   method, protocol, ip, hostname, path, port, headers, timeout, toClientResponse,
                   hasExternalProxy, proxyType, proxyIp, proxyPort
               }) {
        // http.request 解析dns时，偶尔会出错
        // pipe流 获取远程数据 并做记录
        try {
            if (recordResponse) {
                toClientResponse.remoteRequestBeginTime = Date.now();
            }
            let wrapperReq = req;
            let streamMonitor;
            if (recordResponse) {
                streamMonitor = new StreamMonitor();
                wrapperReq = req.pipe(streamMonitor);
            }
            let proxyResponsePromise = this._requestServer({
                req: wrapperReq, ip, hostname,
                protocol, method, port, path,
                headers, timeout,
                hasExternalProxy, proxyType, proxyIp, proxyPort
            });
            let proxyResponse = await proxyResponsePromise;
            // 记录日志
            let wrappedStream;
            let resMonitorStream;
            if (recordResponse) {
                const {headers, monitoredStream} = requestResponseUtils.monitorResponseStream(proxyResponse);
                toClientResponse.headers = _.assign({}, headers, toClientResponse.headers);
                wrappedStream = monitoredStream
                resMonitorStream = monitoredStream
            } else {
                toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);
                wrappedStream = proxyResponse
            }

            res.writeHead(proxyResponse.statusCode, toClientResponse.headers);
            // 向服务器返回发送给浏览器
            wrappedStream.pipe(res);
            toClientResponse.sendedToClient = true;

            if (recordResponse) {
                toClientResponse.remoteResponseStartTime = Date.now();
                toClientResponse.statusCode = proxyResponse.statusCode;
                let reqData = await streamMonitor.getAllDataAsync()
                // http://cpro.baidustatic.com:80/cpro/ui/c.js 这个资源获取返回内容会出错
                let resData = await resMonitorStream.getAllDataAsync();
                toClientResponse.remoteResponseEndTime = Date.now();
                toClientResponse.body = resData;
                toClientResponse.hasContent = true;
                toClientResponse.requestData = {
                    method,
                    protocol,
                    port,
                    path,
                    headers,
                    body: reqData
                };
            }
        } catch (e) {
            let href = `${protocol}//${hostname}:${port}${path}`;
            toClientResponseUtils.setError(toClientResponse, href, e);
        }
    }

    /**
     * 将请求远程的响应内容
     */
    async cache({
                    req, res, recordResponse, method,
                    protocol, ip, hostname, path, port,
                    headers, toClientResponse, timeout,
                    hasExternalProxy, proxyType, proxyIp, proxyPort
                }) {

        try {
            toClientResponse.remoteRequestBeginTime = Date.now();

            let proxyResponsePromise = await this._requestServer({
                req, ip, hostname,
                protocol, method, port, path,
                headers, timeout,
                hasExternalProxy, proxyType, proxyIp, proxyPort
            });

            // 记录日志
            let clientRequestPromise;
            if (recordResponse) {
                clientRequestPromise = requestResponseUtils.getClientRequestBody(req);
            }

            let proxyResponse = await proxyResponsePromise;

            toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);
            delete toClientResponse.headers['content-encoding'];
            delete toClientResponse.headers['transfer-encoding'];

            toClientResponse.remoteResponseStartTime = Date.now();
            toClientResponse.statusCode = proxyResponse.statusCode;
            let resData = await requestResponseUtils.getServerResponseBody(proxyResponse);
            toClientResponse.remoteResponseEndTime = Date.now();
            toClientResponse.body = resData;
            toClientResponse.hasContent = true;

            if (recordResponse) {
                let reqData = await clientRequestPromise;
                toClientResponse.requestData = {
                    method,
                    protocol,
                    port,
                    path,
                    headers,
                    body: reqData
                };
            }

        } catch (e) {
            let href = `${protocol}//${hostname}:${port}${path}`;
            toClientResponseUtils.setError(toClientResponse, href, e);
        }
    }

    /**
     * 根据RequestContent
     */
    async cacheFromRequestContent({
                                      requestContent, recordResponse, toClientResponse, timeout,
                                      hasExternalProxy, proxyType, proxyIp, proxyPort
                                  }) {
        let {protocol, hostname, ip, pathname, port, query, method, headers, body} = requestContent;
        try {
            toClientResponse.remoteRequestBeginTime = Date.now();
            let path = `${pathname}?${queryString.stringify(query)}`;
            let proxyResponse = await this._requestServer({
                body: requestContent.body,
                protocol, method, port, path,
                ip, hostname, headers, timeout,
                hasExternalProxy, proxyType, proxyIp, proxyPort
            });

            toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);
            delete toClientResponse.headers['content-encoding'];
            delete toClientResponse.headers['transfer-encoding'];

            toClientResponse.remoteResponseStartTime = Date.now();

            toClientResponse.statusCode = proxyResponse.statusCode;
            let resData = await requestResponseUtils.getServerResponseBody(proxyResponse);
            toClientResponse.remoteResponseEndTime = Date.now();
            toClientResponse.body = resData;
            toClientResponse.hasContent = true;
            if (recordResponse) {
                toClientResponse.requestData = {
                    method,
                    protocol,
                    port,
                    path,
                    headers,
                    body: requestContent.body
                };
            }
        } catch (e) {
            let href = `${protocol}//${hostname}:${port}${pathname}?${queryString.stringify(query)}`;
            toClientResponseUtils.setError(toClientResponse, href, e);
        }
    }

    // 请求远程服务器，并将响应流通过promise的方式返回
    _requestServer({
                       req, body, protocol, method, ip, hostname, port, path, headers, timeout = 10000,
                       hasExternalProxy = false, proxyType, proxyIp, proxyPort
                   }) {
        let proxyRequestPromise = new Promise((resolve, reject) => {
            let requestPath = '';
            let requestProtocol = '';
            let requestPort = '';
            let requestHostname = '';
            let agent = null;
            if (!hasExternalProxy) {
                requestPath = path;
                requestProtocol = protocol;
                requestPort = port;
                requestHostname = ip || hostname;
            } else if (proxyType == 'http') {
                requestPath = `${protocol}//${ip}:${port}${path}`;
                requestProtocol = 'http:';
                requestPort = proxyPort;
                requestHostname = proxyIp;
            } else if (proxyType == 'socks5') {
                requestPath = path;
                requestProtocol = protocol;
                requestPort = port;
                requestHostname = hostname;
                agent = new SocksProxyAgent({
                    protocol: 'socks:',
                    hostname: proxyIp,
                    port: +proxyPort
                });
            }
            let client = requestProtocol === 'https:' ? https : http;
            let proxyRequest = client.request({
                protocol: requestProtocol,
                method,
                port: requestPort,
                path: requestPath,
                hostname: requestHostname,
                desIp: ip,
                headers,
                timeout,
                rejectUnauthorized: false,
                setHost: false,
                agent
            }, (proxyResponse) => {
                // 有响应时返回promise
                resolve(proxyResponse);
            });
            proxyRequest.on('error', (e) => {
                reject(e);
            });
            proxyRequest.on('timeout', () => {
                reject(new Error(`timeout ${requestHostname} ${timeout}`));
                proxyRequest.destroy();
            });
            if (req) {
                req.pipe(proxyRequest);
            } else {
                proxyRequest.end(body);
            }
        });
        return proxyRequestPromise;
    }
};
