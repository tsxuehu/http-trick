import Router from "koa-router";
import cookieParser from "cookie";


export default function getRouter() {
    let router = new Router();
    // 注册中间件，获取用户身份
    router.use( async (ctx, next) => {
        // 取用户Id
        let cookies = cookieParser.parse(ctx.request.headers.cookie);
        ctx.userId = cookies['userId'] || '0';
        await next();
        yield next;
    });

    require('./controller/config-controller').regist(router);
    require('./controller/data-controller').regist(router);
    require('./controller/host-controller').regist(router);
    require('./controller/rule-controller').regist(router);


    return router.routes();
}