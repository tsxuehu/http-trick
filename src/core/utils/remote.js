const axios = require("axios");
const queryString = require("query-string");
const resovleIp = require("./dns");
const log = require("./log");
const _ = require("lodash");
const http = require('http');
const https = require('https');
const toClientResponseUtils = require('./toClientResponseUtils');
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
                   protocol, hostname, path, port, headers, timeout = 10000, toClientResponse
               }) {
        let isHttps = protocol.indexOf('https') > -1;
        // http.request 解析dns时，偶尔会出错
        // 使用axios获取远程数据
        // pipe流 获取远程数据 并做记录
        let href = '';
        let ip = '';
        try {
            if (recordResponse) {
                toClientResponse.dnsResolveBeginTime = new Date().getTime();
            }
            ip = await resovleIp(hostname);
            href = `${protocol}//${ip}:${port}${path}`;

            if (recordResponse) {
                toClientResponse.remoteIp = ip;
                toClientResponse.requestBeginTime = new Date().getTime();

            }
            let remoteResponse = await axios({
                method: req.method,
                url: href,
                headers: headers,
                maxRedirects: 0,
                responseType: 'arraybuffer',
                data: req,
                // 禁止自动转换body
                transformResponse: [function transformResponse(data) {
                    return data;
                }],
                timeout,
                validateStatus: _.stubTrue
            });
            toClientResponse.sendedToClient = true;
            toClientResponse.hasContent = true;
            Object.assign(toClientResponse.headers, remoteResponse.headers, { 'content-length': Buffer.byteLength(remoteResponse.data) });
            toClientResponse.statusCode = remoteResponse.status;
            // 返回结果
            res.writeHead(toClientResponse.statusCode, toClientResponse.headers);
            res.end(remoteResponse.data);

        } catch (e) {
            toClientResponseUtils.setError(toClientResponse, `${protocol}//${hostname}:${port}${path}`, e);
            log.error(hostname, href, e);
        }
    }

    /**
     * 将请求远程的响应内容
     */
    async cache({
                    req, res,
                    protocol, hostname, path, port,
                    headers, toClientResponse, timeout = 10000
                }) {
        let href = '';
        try {
            let ip = await resovleIp(hostname);
            href = `${protocol}//${ip}:${port}${path}`;
            // 设置超时时间，节约socket资源
            let response = await axios({
                method: req.method,
                url: href,
                headers: headers,
                maxRedirects: 0,
                responseType: 'text',
                data: req,
                // 禁止自动转换body
                transformResponse: [function transformResponse(data) {
                    return data;
                }],
                timeout,
                validateStatus: _.stubTrue
            });
            toClientResponse.sendedToClient = false;
            toClientResponse.hasContent = true;
            toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
            toClientResponse.body = response.data;
            toClientResponse.statusCode = response.status;
        } catch (e) {
            toClientResponseUtils.setError(toClientResponse, `${protocol}//${hostname}:${port}${path}`, e);
            log.error(hostname, href, e);
        }
    }

    /**
     * 根据RequestContent
     */
    async cacheFromRequestContent({ requestContent, toClientResponse, timeout = 10000 }) {
        let { protocol, hostname, path, port, query, method, headers, body } = requestContent;
        try {
            let ip = await resovleIp(hostname);
            let href = `${protocol}//${ip}:${port}${path}?${queryString.stringify(query)}`;
            let response = await axios({
                method,
                url: href,
                headers,
                maxRedirects: 0,
                responseType: 'text',
                data: body,
                validateStatus: null,
                // 禁止自动转换body
                transformResponse: [function transformResponse(data) {
                    return data;
                }],
                timeout,
                validateStatus: _.stubTrue
            });
            toClientResponse.sendedToClient = false;
            toClientResponse.hasContent = true;
            toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
            toClientResponse.body = response.data;
            toClientResponse.statusCode = response.status;
        } catch (e) {
            toClientResponseUtils.setError(toClientResponse, `${protocol}//${ip}:${port}${path}?${queryString.stringify(query)}`, e);
            log.error(hostname, href, e);
        }

    }
};