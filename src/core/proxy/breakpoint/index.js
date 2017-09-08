import Repository from "../../repository";

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
        this.breakpointRepository = Repository.getBreakpointRepository();
    }

    run({
            req, res, urlObj, clientIp, breakpointId, requestContent
        }) {
        // 是否有请求断点，若有则放入repository，函数返回

        // 获取服务器端内容

        // 是否有响应断点，若有则放入repository，函数返回

        // 响应浏览器（一个空断点会执行到这一步）

    }
}