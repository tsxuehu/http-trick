
import  Router from 'koa-router';



/**
 * 读取请求的body
 */




export default function getRouter() {
    let router = new Router();

    require('./controller/config-controller').regist(router);
    require('./controller/data-controller').regist(router);
    require('./controller/host-controller').regist(router);
    require('./controller/rule-controller').regist(router);

    return router.routes();
}