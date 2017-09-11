import Repository from "../../repository";
import sendSpecificToClient from "../proxy/sendToClient/specific";
import Remote from "../proxy/content/remote";
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
export default class Breakpoint {
    static getBreakpoint() {
        if (!breakpoint) {
            breakpoint = new Breakpoint();
        }
        return breakpoint;
    }

    constructor() {
        this.remote = Remote.getRemote();
        this.instanceReqRes = {};
        this.breakpointRepository = Repository.getBreakpointRepository();
    }

    async run({
                  req, res, breakpointId, requestContent, urlObj, clientIp
              }) {
        // 保存请求的req 和 res
        let instanceId = this.breakpointRepository.addInstance({
            breakpointId,
            method: req.method,
            clientIp, href: urlObj.href
        });
        this.instanceReqRes[instanceId] = {req, res};

        // 放入repository，若有请求断点，函数返回
        this.breakpointRepository.setInstanceRequestContent(instanceId, requestContent);
        if (this.breakpointRepository.hasRequestBreak(breakpointId)) return;

        // 获取服务器端内容
        let responseContent = await this.sendToServer(breakpointId);
        this.breakpointRepository.setInstanceServerResponseContent(instanceId, responseContent);
        // 是否有响应断点，若有则放入repository，函数返回
        if (this.breakpointRepository.hasResponseBreak(breakpointId)) return;
        // 响应浏览器（一个空断点会执行到这一步）
        await this.sendToClient(instanceId);
        // 将请求发送给浏览器
        this.breakpointRepository.sendedInstanceServerResponseToClient(instanceId);
    }

    /**
     * 将请求数据发送给服务端
     */
    async sendToServer(instanceId) {
        // 向服务器发送请求

        let requestContent = this.breakpointRepository.getInstanceRequestContent(instanceId);
        let responseContent = {};
        await this.remote.cacheFromRequestContent({
            requestContent, toClientResponse: responseContent
        });
        this.breakpointRepository.setInstanceServerResponseContent(instanceId,responseContent);
    }

    /**
     * 将内容发送给浏览器
     * @param id
     */
    sendToClient(instanceId) {
        // 响应浏览器
        let instance = this.instanceReqRes[instanceId];
        let res = instance.res;
        let responseContent = this.breakpointRepository.getInstanceResponseContent(instanceId);
        sendSpecificToClient({
            res, statusCode: 200, headers: responseContent.headers, content: responseContent.body
        });
        // 删除
        delete this.instanceReqRes[instanceId];
    }
}