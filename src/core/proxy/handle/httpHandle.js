import zlib from "zlib";
import parseUrl from "../../utils/parseUrl";
import Repository from "../../repository";
import Action from "../action/action";
import getClientIp from "../../utils/getClientIp";
// request session id seed
let idx = 0;
let httpHandle;
export default class HttpHandle {

    static getHttpHandle() {
        if (!httpHandle) {
            httpHandle = new HttpHandle();
        }
        return httpHandle;
    }

    constructor() {
        this.actionMap = Action.getActionMap();

        this.ruleRepository = Repository.getRuleRepository();
        this.configureRepository = Repository.getConfigureRepository();
        this.runtimeRepository = Repository.getRuntimeInfoRepository();
        this.breakpointRepository = Repository.getBreakpointRepository();
        this.filterRepository = Repository.getFilterRepository();
    }

    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    handle(req, res) {
        // 解析请求参数
        let urlObj = parseUrl(req);

        // 如果是 ui server请求，则直接转发不做记录

        if ((urlObj.hostname == '127.0.0.1' || urlObj.hostname == this.configureRepository.getPcIp())
            && urlObj.port == this.configureRepository.getRealUiPort()) {
            actionMap['bypass'].run({req, res, urlObj});
            return;
        }

        // 如果有客户端监听请求内容，则做记录
        if (this.runtimeRepository.hasHttpTraficMonitor()) {
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

        let clientIp = getClientIp(req);


        // =========================================
        // 断点
        if (this.breakpointRepository.hasBreakpoint(clientIp, req.method, urlObj)) {


            return;
        }

        // =====================================================
        // 限流 https://github.com/tjgq/node-stream-throttle


        let matchedRule = this.ruleRepository.getProcessRule(clientIp, req.method, urlObj);


        this._runAtions(req, res, urlObj, clientIp, matchedRule);
    }

    /**
     * 运行动作
     * @returns {Promise.<void>}
     * @private
     */
    async _runAtions(req, res, urlObj, clientIp, rule) {
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
        };

        // 转发规则处理
        if (!this.configureRepository.getEnableRule(clientIp)) {// 判断转发规则有没有开启
            toClientResponse.headers['fe-proxy-rule-disabled'] = "true";
        }

        // 查找过滤器
        let filterRuleList = this.filterRepository.getFilterRuleList(clientIp, urlObj);

        // 生成要执行的action列表
        let beforeFilterActionsInfo = [];
        let afterFilterActionsInfo = [];

        _.forEach(filterRuleList, rule => {
            _.forEach(rule.actionList, action => {
                let actionHandler = this.actionMap[action.type];
                if (actionHandler.needResponse()) {
                    afterFilterActionsInfo.push({
                        action: action,
                        rule: rule
                    })
                } else {
                    beforeFilterActionsInfo.push({
                        action: action,
                        rule: rule
                    })
                }
            });
        });




        let ruleActionsInfo = [];
        _.forEach(rule.actionList, action => {
            ruleActionsInfo.push({
                action: action,
                rule: rule
            })
        });

        let willRunActionList = beforeFilterActionsInfo.concat(ruleActionsInfo).concat(afterFilterActionsInfo);

        let willRunActionListLength = willRunActionList.length;
        // 执行前置动作
        for (let i = 0; i < willRunActionListLength; i++) {
            // 对每一个规则 执行action
            let actionInfo = willRunActionList[i];
            let action = actionInfo.action;
            let rule = actionInfo.rule;
            let actionHandler = this.actionMap[action.type];
            toClientResponse.headers[`fe-proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-${!!actionHandler}`);
            if (actionHandler) {

            }
        }

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

    async _getRequestContent(req, urlObj) {
        let body = await this.getRequestBody(req);
        let {protocol, hostname, path, port} = urlObj;
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