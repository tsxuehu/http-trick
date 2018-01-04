const axios = require("axios");
const queryString = require("query-string");
const resovleIp = require("./dns");
const log = require("./log");
const _ = require("lodash");
const http = require('http');
const https = require('https');
const toClientResponseUtils = require('./toClientResponseUtils');
const requestResponseUtils = require('./requestResponseUtils');
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
                   method, protocol, hostname, path, port, headers, timeout, toClientResponse
               }) {
        // http.request 解析dns时，偶尔会出错
        // pipe流 获取远程数据 并做记录

        let ip = '';
        try {
            if (recordResponse) {
                toClientResponse.dnsResolveBeginTime = new Date().getTime();
            }
            ip = await resovleIp(hostname);
            toClientResponse.headers['remote-ip'] = ip;
            if (recordResponse) {
                toClientResponse.remoteIp = ip;
                toClientResponse.requestBeginTime = new Date().getTime();
            }

            let proxyResponsePromise = this._requestServer({
                req,
                protocol, method, port, path,
                ip, headers, timeout
            });
            // 记录日志
            let clientRequestPromise;
            if (recordResponse) {
                clientRequestPromise = requestResponseUtils.getClientRequestBody(req);
            }
            let proxyResponse = await proxyResponsePromise;
            toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);

            res.writeHead(proxyResponse.statusCode, toClientResponse.headers);
            proxyResponse.pipe(res);
            toClientResponse.sendedToClient = true;

            if (recordResponse) {
                toClientResponse.serverResponseTime = new Date().getTime();
                toClientResponse.statusCode = proxyResponse.statusCode;
                let reqData = await clientRequestPromise;
                let resData = await requestResponseUtils.getServerResponseBody(proxyResponse);
                toClientResponse.requestEndTime = new Date().getTime();
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
            log.error(hostname, href, e);
        }
    }

    /**
     * 将请求远程的响应内容
     */
    async cache({
                    req, res, recordResponse, method,
                    protocol, hostname, path, port,
                    headers, toClientResponse, timeout
                }) {

        try {
            toClientResponse.dnsResolveBeginTime = new Date().getTime();

            let ip = await resovleIp(hostname);
            toClientResponse.headers['remote-ip'] = ip;

            toClientResponse.remoteIp = ip;
            toClientResponse.requestBeginTime = new Date().getTime();

            let proxyResponsePromise = await this._requestServer({
                req,
                protocol, method, port, path,
                ip, headers, timeout
            });

            // 记录日志
            let clientRequestPromise;
            if (recordResponse) {
                clientRequestPromise = requestResponseUtils.getClientRequestBody(req);
            }

            let proxyResponse = await proxyResponsePromise;

            toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);

            toClientResponse.serverResponseTime = new Date().getTime();
            toClientResponse.statusCode = proxyResponse.statusCode;
            let resData = await requestResponseUtils.getServerResponseBody(proxyResponse);
            toClientResponse.requestEndTime = new Date().getTime();
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
            log.error(hostname, href, e);
        }
    }

    /**
     * 根据RequestContent
     */
    async cacheFromRequestContent({ requestContent, recordResponse, toClientResponse, timeout }) {
        let { protocol, hostname, pathname, port, query, method, headers, body } = requestContent;
        try {
            toClientResponse.dnsResolveBeginTime = new Date().getTime();

            let ip = await resovleIp(hostname);
            toClientResponse.headers['remote-ip'] = ip;

            toClientResponse.remoteIp = ip;
            toClientResponse.requestBeginTime = new Date().getTime();
            let path = `${pathname}?${queryString.stringify(query)}`;
            let proxyResponse = await this._requestServer({
                body: requestContent.body,
                protocol, method, port, path,
                ip, headers, timeout
            });

            toClientResponse.headers = _.assign({}, proxyResponse.headers, toClientResponse.headers);

            toClientResponse.serverResponseTime = new Date().getTime();

            toClientResponse.statusCode = proxyResponse.statusCode;
            let resData = await requestResponseUtils.getServerResponseBody(proxyResponse);
            toClientResponse.requestEndTime = new Date().getTime();
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
            log.error(hostname, href, e);
        }
    }

    _requestServer({ req, body, protocol, method, port, path, ip, headers, timeout = 10000 }) {
        let proxyRequestPromise = new Promise((resolve, reject) => {
            let client = protocol === 'https:' ? https : http;
            let proxyRequest = client.request({
                protocol,
                method,
                port,
                path,
                hostname: ip,
                headers,
                timeout,
                rejectUnauthorized: false
            }, (proxyResponse) => {
                // 有响应时返回promise
                resolve(proxyResponse);
            });
            proxyRequest.on('error', (e) => {
                reject(e);
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