import Repository from "../../repository";

export default class BreakpointController {
    constructor() {
        this.breakpointRepository = Repository.getBreakpointRepository();
    }

    regist(router) {
        router.get('/breakpoint/sendToServer', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = '';
            this.body = '';
        });

        router.get('/breakpoint/sendToClient', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = '';
            this.body = '';
        });

        router.get('/breakpoint/save', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = '';
            this.body = {
                breakpointId
            };
        });

        router.get('/breakpoint/delete', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = '';
            this.body = '';
        });
        /**
         * 获取用户的所有断点列表
         */
        router.get('/breakpoint/getAll', async (ctx, next) => {
            let userId = ctx.userId;
            let breakpointId = '';
            this.body = '';
        });
    }
}