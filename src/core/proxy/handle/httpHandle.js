var actionMap = require('../action');
var getMatchedRule = require('./getMatchedRule');
var notify = require('../../notify');
var zlib = require('zlib');
var parseUrl = require('../../utils/parseUrl');
var dc = require('../../datacenter');
var runActions = require('./../action/run-actions');

// request session id seed
var idx = 0;
let httpHandle;
export default class HttpHandle {

    static getHttpHandle(){
        if (!httpHandle){
            httpHandle = new HttpHandle();
        }
        return httpHandle;
    }
    constructor(){

    }
    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    handle(req, res){
        // 解析请求参数
        var urlObj = parseUrl(req);
        req.urlObj = urlObj; // 绑定url请求信息，方便异常处理函数中做日志

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

            if (req.method == 'POST' || req.method == 'PUT' || req.method == 'PATCH') {
                // 二进制文件 不记录 todo
                var body = '';
                // 图片类型的body需要进行特殊处理
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    // receive post data done and notify to update web ui
                    notify.reqBody(sid, req, res, body);
                });
            }
            // 记录响应
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
                            notify.response(sid, req, res, decoded && decoded.toString('binary'));
                        });
                    } else if (encoding == 'deflate') {
                        zlib.inflate(buffer, function (err, decoded) {
                            notify.response(sid, req, res, decoded && decoded.toString('binary'));
                        });
                    } else {
                        notify.response(sid, req, res, buffer.toString('binary'));
                    }
                });
            });
        }

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

    async runAtions(){
        // 查找过滤器

        // 执行前置动作

        // 执行请求指定动作

        // 执行请求后置动作
    }
}