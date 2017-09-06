import Repository from "../../repository";

export default class WsMockController {
    constructor() {
        this.wsMockRepository = Repository.getWsMockRepository();
    }

    regist(router) {
        router.get('/wsMock/opensession', async (ctx, next) => {
            let userId = ctx.userId;
            let sessionId = this.wsMockRepository.openSession(userId, debugClient.id, urlPattern);
            this.sendAssignedSessionIdToUser(userId, urlPattern, sessionId);
            this.body = '';
        });

        router.get('/wsMock/closesession', async (ctx, next) => {
            let userId = ctx.userId;
            this.wsMockRepository.closeSession(sessionId);
            this.body = '';
        });

        router.get('/wsMock/debuggermsg', async (ctx, next) => {
            let userId = ctx.userId;
            this.wsMockRepository.sendToPageMsg(sessionId, data);
            this.body = '';
        });
    }
}