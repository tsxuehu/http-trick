const ServiceRegistry = require("../../service");
const sendSpecificToClient = require("../proxy/sendToClient/specific");
const Remote = require("../proxy/content/remote");
const _ = require("lodash");
/**
 * 断点处理
 * 可在两个地方设置断点 request 、 response
 * request: 修改请求，然后再发送到服务器
 * response: 修改服务器的响应，然后再发送给浏览器
 *
 * 工作流程：
 * 将request、response发送给breakpoint repository
 * 监听breakpoint repository事件，
 */
let breakpoint;
module.exports = class Breakpoint {
    static getBreakpoint() {
        if (!breakpoint) {
            breakpoint = new Breakpoint();
        }
        return breakpoint;
    }

    constructor() {
        // 记录客户端的请求、响应对象
        this.instanceReqRes = {};

        this.breakpointService = ServiceRegistry.getBreakpointService();
        this.userService = ServiceRegistry.getUserService();

        this.remote = Remote.getRemote();
        // 删除断点后，释放断点实例
        this.breakpointService.on('breakpoint-delete', (userId, breakpointId, toDeleteInstance) => {
            this.endRequest(toDeleteInstance);
        })
        // 将请求发送给客户端
        this.breakpointService.on('send-instance-to-client', ( instanceId) => {
            this.sendToClient(instanceId);
        })
    }

    async run({
                  req, res, breakpointId, requestContent, urlObj, clientIp
              }) {
        // 保存请求的req 和 res
        let instanceId = this.breakpointService.addInstance({
            breakpointId,
            method: req.method,
            clientIp, href: urlObj.href
        });
        this.instanceReqRes[instanceId] = {req, res};

        let breakpoint = await this.breakpointService.getBreakpoint(clientIp, breakpointId);

        // 放入repository，若有请求断点，函数返回
        this.breakpointService.setInstanceRequestContent(instanceId, requestContent);
        if (breakpoint.requestBreak) return;

        // 获取服务器端内容
        let responseContent = await this.getServerResponse(breakpointId);
        this.breakpointService.setInstanceServerResponseContent(instanceId, responseContent);
        // 是否有响应断点，若有则放入repository，函数返回
        if (breakpoint.responseBreak) return;
        // 响应浏览器（一个空断点会执行到这一步）
        await this.sendToClient(instanceId);
        // 删除记录信息
        this.breakpointService.deleteInstanceSlient(instanceId);

    }


    /**
     * 将内容发送给浏览器
     * @param id
     */
    sendToClient(instanceId) {
        // 响应浏览器
        let instance = this.instanceReqRes[instanceId];
        let res = instance.res;
        let responseContent = this.breakpointService.getInstanceResponseContent(instanceId);
        sendSpecificToClient({
            res, statusCode: 200, headers: responseContent.headers, content: responseContent.body
        });
        // 删除
        delete this.instanceReqRes[instanceId];
    }

    /**
     * 用户删除断点时，断点关联的请求被删除
     * @param instanceIds
     */
    endRequest(instanceIds) {
        for (let instanceId of instanceIds) {
            let instance = this.instanceReqRes[instanceId];
            if (!instance) continue;
            let res = instance.res;
            sendSpecificToClient({
                res, statusCode: 500, headers: {breakpoint: "user close breakpoint"}, content: "user close breakpoint"
            });
            // 删除
            delete this.instanceReqRes[instanceId];
        }
    }

    /**
     * 根据请求匹配断点
     * @param clientIp
     * @param method
     * @param urlObj
     * @returns {Promise.<*>}
     */
    async getBreakpointId(userId, method, urlObj) {
        // clientIp 转 userId
        let connectionsCnt = await this.breakpointService.getUserConnectionCount(userId);
        // 没有断点界面，则断点不生效
        if (connectionsCnt == 0) return -1;
        let userBreakPoints = await this.breakpointService.getUserBreakPoints(userId);
        let finded = _.find(userBreakPoints, (breakpoint, id) => {
                return this._isMethodMatch(method, breakpoint.method)
                    && this._isUrlMatch(urlObj.href, breakpoint.match) && breakpoint.enable
            }) || {id: -1};
        return finded.id;
    }

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod, breakpointMethod) {
        let loweredReqMethod = _.lowerCase(reqMethod);
        let loweredBreakpointMethod = _.lowerCase(breakpointMethod);
        return loweredReqMethod == loweredBreakpointMethod
            || !breakpointMethod;
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl, breakpointMatchStr) {
        return breakpointMatchStr && (reqUrl.indexOf(breakpointMatchStr) >= 0
            || (new RegExp(breakpointMatchStr)).test(reqUrl));
    }
}