'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getRouter;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 读取请求的body
 */

function getRouter() {
    let router = new _koaRouter2.default();

    require('./controller/config-controller').regist(router);
    require('./controller/data-controller').regist(router);
    require('./controller/host-controller').regist(router);
    require('./controller/rule-controller').regist(router);

    return router.routes();
}