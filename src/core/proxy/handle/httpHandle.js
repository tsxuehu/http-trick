var actionMap = require('../action');
var getMatchedRule = require('./getMatchedRule');
var notify = require('../../notify');
var zlib = require('zlib');
var parseUrl = require('../../utils/parseUrl');
var dc = require('../../datacenter');
var runActions = require('./../action/run-actions');


import getClientIp from "../../utils/getClientIp";
// request session id seed
var idx = 0;
let httpHandle;
export default class HttpHandle {

    static getHttpHandle() {
        if (!httpHandle) {
            httpHandle = new HttpHandle();
        }
        return httpHandle;
    }

    constructor() {

    }

    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    handle(req, res) {
        // 解析请求参数
        var urlObj = parseUrl(req);
        req.urlObj = urlObj; // 绑定url请求信息，方便异常处理函数中做日志

        req.clientIp = getClientIp(req);

        // 如果是 ui server请求，则直接转发不做记录

        if ((urlObj.hostname == '127.0.0.1' || urlObj.hostname == dc.getPcIp()) && urlObj.port == dc.getRealUiPort()) {
            actionMap['bypass'].run({req, res, urlObj});
            return;
        }

        // 如果有客户端监听请求内容，则做记录
        if (dc.hasHttpTraficMonitor()) {
            // 记录请求
            var sid = ++idx;
            if (idx > 2000) idx = 0;
            notify.request(sid, req, res);

            // 日记记录body
            this._getRequestBody().then(body => {
                notify.reqBody(sid, req, res, body);
            });

            this._getResponseToClient(res).then(response => {
                notify.response(sid, req, res, response);
            });
        }

        // 限流 https://github.com/tjgq/node-stream-throttle

        // 断点

        // 规则处理

        // 透传

        // 判断转发规则有没有开启


        // 路由请求
        var matchedRule = getMatchedRule(req, urlObj);
        if (matchedRule.type == 'userRule') {
            // 日志记录匹配的规则
            res.setHeader('fe-proxy-rule-match', encodeURI(matchedRule.info));
            runActions(req, res, urlObj, matchedRule.rule);
        } else {
            actionMap['bypass'].run({req, res, urlObj, actionIndex: 0});
        }
    }

    /**
     * 运行动作
     * @returns {Promise.<void>}
     * @private
     */
    async _runAtions() {
        // 原始的请求头部
        let requestContent = {
            hasContent: false,
            protocol: '',
            hostname: '',
            path: '',
            port: '',
            headers: {},
            body: ''
        };
        // 额外发送的头部
        let extraRequestHeaders = {};
        // 要发送给浏览器的内容
        let toClientResponse = {
            hasContent: false,// 是否存在要发送给浏览器的内容
            sendedToClient: false, // 已经向浏览器发送响应内容
            headers: {},// 要发送给浏览器的header
            body: ''// 要发送给浏览器的body
        }
        // 查找过滤器

        // 执行前置动作

        // 执行请求指定动作 (获取内容时，追加header日志)

        // 执行请求后置动作
    }

    // 同一个请求，返回同一个Promise
    _getRequestBody(req) {

        if (req.fetchDataPromise) {
            return req.fetchDataPromise;
        }

        let resolve = _.noop;
        let promise = new Promise(_ => {
            resolve = _;
        });

        if (req.method == 'POST' || req.method == 'PUT' || req.method == 'PATCH') {
            // 二进制文件 不记录 todo
            let body = '';
            // 图片类型的body需要进行特殊处理
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                resolve(body);
            });
        } else {
            resolve("");
        }

        req.fetchDataPromise = promise;
        return req.fetchDataPromise;
    }

    async _getRequestContent(req) {
        let body = await this.getRequestBody(req);
        let {protocol, hostname, path, port} = req.urlObj;
        return {
            hasContent: true,
            protocol,
            hostname,
            method: req.method,
            path,
            port,
            headers: _.assign({}, req.headers),
            body
        };
    }

    _getResponseToClient(res) {
        if (res.responseToClientPromise) {
            return req.responseToClientPromise;
        }

        let resolve = _.noop;
        let promise = new Promise(_ => {
            resolve = _;
        });

        // 对服务器端的响应流做记录
        res.on('pipe', function (readStream) {
            var chunks = [];
            readStream.on('data', function (chunk) {
                chunks.push(chunk);
                //  res.write(chunk);
            });
            readStream.on('end', function () {
                var headers = readStream.headers || [];
                var buffer = Buffer.concat(chunks);
                var encoding = headers['content-encoding'];
                // handler gzip & defalte transport
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function (err, decoded) {
                        resolve(decoded && decoded.toString('binary'));
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function (err, decoded) {
                        resolve(decoded && decoded.toString('binary'));
                    });
                } else {
                    resolve(buffer.toString('binary'));
                }
            });
        });

        res.responseToClientPromise = promise;
        return res.responseToClientPromise;
    }
}