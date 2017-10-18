const Service = require("../../service");

module.exports = class WsMockController {
    constructor() {
        this.wsMockService = Service.getWsMockRepository();
    }

    regist(router) {
        // 开启调试会话
        router.get('/wsMock/opensession', async (ctx, next) => {
            let userId = ctx.userId;
            let sessionId = this.wsMockService.openSession(userId, debugClient.id, urlPattern);
            this.sendAssignedSessionIdToUser(userId, urlPattern, sessionId);
            this.body = '';
        });
        // 关闭调试会话
        router.get('/wsMock/closesession', async (ctx, next) => {
            let userId = ctx.userId;
            this.wsMockService.closeSession(sessionId);
            this.body = '';
        });
        // 调试消息
        router.get('/wsMock/debuggermsg', async (ctx, next) => {
            let userId = ctx.userId;
            this.wsMockService.sendToPageMsg(sessionId, data);
            this.body = '';
        });
    }
}