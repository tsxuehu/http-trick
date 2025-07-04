"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const log4js_1 = tslib_1.__importDefault(require("log4js"));
const router_1 = tslib_1.__importDefault(require("@koa/router"));
const http_1 = tslib_1.__importDefault(require("http"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const koa_1 = tslib_1.__importDefault(require("koa"));
const annotation_1 = require("di/annotation");
const global_var_1 = require("../utils/global-var");
const AppInfoService_1 = tslib_1.__importDefault(require("service/AppInfoService"));
const cookie_1 = tslib_1.__importDefault(require("cookie"));
const socket_ip_1 = require("../utils/socket-ip");
const koa_qs_1 = tslib_1.__importDefault(require("koa-qs"));
const koa_static_1 = tslib_1.__importDefault(require("koa-static"));
const path_1 = tslib_1.__importDefault(require("path"));
const koa_body_1 = tslib_1.__importDefault(require("koa-body"));
const logger = log4js_1.default.getLogger('UiServer');
const LazyResource = (0, annotation_1.createLazyResource)(global_var_1.getContainer);
class UiServer {
    constructor({ container, port }) {
        this.container = container;
        this.port = port;
    }
    async start() {
        this.app = new koa_1.default();
        this.app.use(async (ctx, next) => {
            let userId = 'root';
            if (!this.appInfoService.isSingle()) {
                let cookies = cookie_1.default.parse(ctx.request.headers.cookie || "");
                userId = cookies['userId'];
                if (!userId) {
                    let ip;
                    ip = ctx.request.headers['x-forwarded-for'];
                    if (!ip) {
                        ip = (0, socket_ip_1.getRemoteIp)(ctx.req.socket);
                    }
                    if (ip.indexOf(',') > -1) {
                        ip = ip.split(',')[0];
                    }
                    userId = ip;
                    ctx.cookies.set('userId', userId, { maxAge: 1000 * 60 * 60 * 24 * 365 });
                }
            }
            ctx.userId = userId;
            await next();
        });
        (0, koa_qs_1.default)(this.app);
        this.app.use((0, koa_body_1.default)({ multipart: true }));
        const apiRouter = await this.assembleRouter();
        this.app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
        this.app.use((0, koa_static_1.default)(path_1.default.join(__dirname, '../../../site')));
        this.server = http_1.default.createServer(this.app.callback());
        this.io = new socket_io_1.default.Server(this.server);
        this.server.listen(this.port);
    }
    async assembleRouter() {
        let router = new router_1.default();
        let routerList = this.container.getRouterInfo();
        for (let routerInfo of routerList) {
            let { httpMethod, requestPath, serviceName, functionName } = routerInfo;
            logger.info(`注册路由 ${httpMethod} ${requestPath}`);
            let instance = await this.container.getServiceInstance(serviceName);
            router[httpMethod](requestPath, async (ctx) => {
                try {
                    const ret = await instance[functionName](ctx);
                    if (ret != undefined) {
                        ctx.body = {
                            code: 0,
                            data: ret,
                        };
                    }
                }
                catch (err) {
                    if (err) {
                        logger.error(err);
                        const { code = err.code || 500, msg = err.message || err.msg || err.error || JSON.stringify(err), data, } = err;
                        ctx.body = {
                            code,
                            msg,
                            data,
                        };
                    }
                }
            });
        }
        return router;
    }
}
exports.default = UiServer;
tslib_1.__decorate([
    LazyResource(),
    tslib_1.__metadata("design:type", AppInfoService_1.default)
], UiServer.prototype, "appInfoService", void 0);
//# sourceMappingURL=UiServer.js.map