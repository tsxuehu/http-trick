import  Router from 'koa-router';
export default function getRouter() {
    let router = new Router();
    // 注册中间件，获取用户身份
    router.use(function *(next) {
        // 取用户Id

        yield next;
    });

    require('./controller/config-controller').regist(router);
    require('./controller/data-controller').regist(router);
    require('./controller/host-controller').regist(router);
    require('./controller/rule-controller').regist(router);


    return router.routes();
}