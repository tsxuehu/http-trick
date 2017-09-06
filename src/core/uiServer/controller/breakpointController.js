import Repository from "../../repository";

export default class BreakpointController {
    constructor() {
        this.breakpointRepository = Repository.getBreakpointRepository();
    }

    regist(router) {
        router.get('/breakpoint/sendToServer', async (ctx, next) => {
            let userId = ctx.userId;
            this.body = '';
        });

        router.get('/breakpoint/sendToClient', async (ctx, next) => {
            let userId = ctx.userId;
            this.body = '';
        });

        router.get('/breakpoint/save', async (ctx, next) => {
            let userId = ctx.userId;
            this.body = '';
        });

        router.get('/breakpoint/delete', async (ctx, next) => {
            let userId = ctx.userId;
            this.body = '';
        });
    }
}