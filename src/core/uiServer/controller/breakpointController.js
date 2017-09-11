import Repository from "../../repository";
import Breakpoint from "../../proxy/breakpoint";
export default class BreakpointController {
    constructor() {
        this.breakpointRepository = Repository.getBreakpointRepository();
        this.breakpoint = Breakpoint.getBreakpoint();
    }

    regist(router) {
        // 将请求发送给服务器 获取响应内容
        router.get('/breakpoint/getResponseContent', async (ctx, next) => {
            let userId = ctx.userId;
            let instanceId = ctx.query.instanceId;
            let requestContent = ctx.body;
            await this.breakpointRepository.setInstanceRequestContent(instanceId, requestContent);
            await this.breakpoint.getServerResponse(instanceId);
            this.body = {
                code: 0
            };
        });
        // 将请求发送给浏览器
        router.get('/breakpoint/instanceSendToClient', async (ctx, next) => {
            let userId = ctx.userId;
            let instanceId = ctx.query.instanceId;
            let responseContent = ctx.body;
            await this.breakpointRepository.setInstanceServerResponseContent(instanceId, responseContent);
            await this.breakpoint.sendToClient(instanceId);
            this.body = '';
        });

        router.get('/breakpoint/save', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpoint = ctx.body;
            await this.breakpointRepository.saveBreakpoint({
                userId,
                connectionId: breakpoint.connectionId,
                match: breakpoint.match,
                requestBreak: breakpoint.requestBreak,
                responseBreak: breakpoint.responseBreak,
                breakpointId: breakpoint.breakpointId,
            });
            this.body = {
                code: 0
            };
        });

        router.get('/breakpoint/delete', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = ctx.query.breakpointId;
            await this.breakpointRepository.deleteBreakpoint(userId, breakpointId);

            this.body = {
                code: 0
            };
        });
        /**
         * 获取用户的所有断点列表
         */
        router.get('/breakpoint/getAll', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpoints =
                await this.breakpointRepository.getUserBreakPoints(userId);
            this.body = {
                code: 0,
                data: breakpoints
            };
        });
    }
}