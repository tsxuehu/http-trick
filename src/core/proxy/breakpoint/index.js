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
    static getBreakpoint(){
        if(!breakpoint){
            breakpoint = new Breakpoint();
        }
        return breakpoint;
    }
    run({
            req, res, urlObj, clientIp
        }) {

    }
}