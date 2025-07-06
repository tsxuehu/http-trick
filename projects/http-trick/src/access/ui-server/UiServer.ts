import log4js from 'log4js'
import Router from '@koa/router'
import {Container} from 'di/container'
import http, {Server} from "http";
import Koa, {Context} from 'koa'
import SocketIO from 'socket.io'
import koa from "koa";
import {createLazyResource} from "di/annotation";
import {getContainer} from "../../utils/global-var";
import AppInfoService from "service/AppInfoService";
import cookie from 'cookie'
import {getRemoteIp} from "../../utils/socket-ip";
import koaQs from "koa-qs"
import staticServe from "koa-static";
import path from "path";
import koaBody from "koa-body";
import cookieParser from "cookie";

const logger = log4js.getLogger('UiServer')

const LazyResource = createLazyResource(getContainer)

export default class UiServer {
    private container: Container
    private port: number
    private server?: Server
    private app?: Koa
    private io?: SocketIO.Server

    // @ts-ignore
    @LazyResource() private appInfoService: AppInfoService

    constructor({container, port}: { container: Container; port: number }) {
        this.container = container
        this.port = port
    }

    async start() {
        this.app = new koa();

        // 身份识别
        this.app.use(async (ctx, next) => {
            let userId = 'root';
            if (!this.appInfoService.isSingle()) {
                let cookies = cookie.parse(ctx.request.headers.cookie || "");
                userId = cookies['userId']!;
                if (!userId) {
                    // 多用户模式 则把用户的ip当做id
                    let ip: string;
                    // 取x-forword-for
                    ip = ctx.request.headers['x-forwarded-for'] as string;
                    if (!ip) {
                        ip = getRemoteIp(ctx.req.socket);
                    }
                    if (ip.indexOf(',') > -1) {
                        ip = ip.split(',')[0];
                    }
                    userId = ip;
                    // 当前机器的ip和用户id绑定. 当机器为ip的机器发代理请求时，会使用userId用户的规则
                    ctx.cookies.set('userId', userId, {maxAge: 1000 * 60 * 60 * 24 * 365});
                }
            }
            ctx.userId = userId;
            await next();
        });
        koaQs(this.app);// query string
        this.app.use(koaBody({multipart: true}));// body解析
        const apiRouter = await this.assembleRouter()
        this.app.use(apiRouter.routes()).use(apiRouter.allowedMethods())// 路由
        this.app.use(staticServe(path.join(__dirname, '../../../site'))); // 静态资源服务

        //
        this.server = http.createServer(this.app.callback());
        this.io = new SocketIO.Server(this.server);
        // 初始化socket io
        this._initTraffic();
        this._initManager();

        // 启动server
        this.server.listen(this.port);
    }

    async assembleRouter() {
        let router = new Router()

        let routerList = this.container.getRouterInfo()
        for (let routerInfo of routerList) {
            let {httpMethod, requestPath, serviceName, functionName} = routerInfo
            logger.info(`注册路由 ${httpMethod} ${requestPath}`)
            let instance = await this.container.getServiceInstance(serviceName)
            // @ts-ignore
            router[httpMethod](requestPath, async (ctx: Context) => {
                try {
                    // @ts-ignore
                    const ret: any = await instance[functionName](ctx)
                    if (ret != undefined) {
                        ctx.body = {
                            code: 0,
                            data: ret,
                        }
                    }
                } catch (err: any) {
                    if (err) {
                        logger.error(err)
                        const {
                            code = err.code || 500,
                            msg = err.message || err.msg || err.error || JSON.stringify(err),
                            data,
                        } = err
                        ctx.body = {
                            code,
                            msg,
                            data,
                        }
                    }
                }
            })
        }
        return router
    }

    // http流量监控界面
    _initTraffic() {
        const httpTraficMonitorNS = this.io!.of('/httptrafic');
        // 客户端发起连接请求
        httpTraficMonitorNS.on('connection', async client => {

            let userId = this._getUserId(client);
            client.join(userId, err => {
            });

            this.httpTrafficService.incMonitor(userId);

            let deviceList = await this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
            // host文件列表
            let hostFileList = await this.hostService.getHostFileList(userId);
            client.emit('hostfilelist', hostFileList);

            // 推送过滤器，状态
            let state = this.httpTrafficService.getStatus(userId);
            client.emit('state', state);
            let filter = this.httpTrafficService.getFilter(userId);
            client.emit('filter', filter);
            client.emit('clear');
            client.on('disconnect', () => {
                this.httpTrafficService.decMonitor(userId);
            });
        });

        // 监听logRespository事件
        this.httpTrafficService.on('traffic', (userId, rows) => {
            this.httpTraficMonitorNS.to(userId).emit('rows', rows);
        });
        // 过滤器改变
        this.httpTrafficService.on('filter', (userId, filter) => {
            this.httpTraficMonitorNS.to(userId).emit('filter', filter);
        });
        // 状态改变
        this.httpTrafficService.on('state-change', (userId, state) => {
            this.httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 清空
        this.httpTrafficService.on('clear', (userId) => {
            this.httpTraficMonitorNS.to(userId).emit('clear');
            let state = this.httpTrafficService.getStatus(userId);
            this.httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 推送设备列表信息
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            this.httpTraficMonitorNS.to(userId).emit('bindedDeviceList', deviceList);
        });

        // host文件变化
        this.hostService.on("data-change", (userId, hostFilelist) => {
            this.httpTraficMonitorNS.to(userId).emit('hostfilelist', hostFilelist);
        });
    }

    // 管理界面 使用的功能
    _initManager() {
        const managerNS = this.io!.of('/manager');

        // 注册通知
        managerNS.on('connection', async client => {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId, err => {
            });
            // 推送最新数据
            // 运行信息
            let appInfo = this.appInfoService.getAppInfo();
            client.emit('appinfo', appInfo);
            // proxy配置
            let config = await this.configureService.getConfigure();
            client.emit('configure', config);
            // 个人配置
            let profile = await this.profileService.getProfile(userId);
            client.emit('profile', profile);
            let deviceList = await this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
            // host文件列表
            let hostFileList = await this.hostService.getHostFileList(userId);
            client.emit('hostfilelist', hostFileList);
            // 规则列表
            let ruleFileList = await this.ruleService.getRuleFileList(userId);
            client.emit('rulefilelist', ruleFileList);
            // 数据文件列表
            let dataList = await this.mockDataService.getMockDataList(userId);
            client.emit('datalist', dataList);
            // 过滤器
            let filters = await this.filterService.getFilterRuleList(userId);
            client.emit('filters', filters);
        });
        // proxy配置信息
        this.configureService.on("data-change", (userId, configure) => {
            this.managerNS.to(userId).emit('configure', configure);
        });
        // 个人配置信息
        this.profileService.on("data-change-profile", (userId, profile) => {
            this.managerNS.to(userId).emit('profile', profile);
        });
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            this.managerNS.to(userId).emit('bindedDeviceList', deviceList);
        });
        // host文件变化
        this.hostService.on("data-change", (userId, hostFilelist) => {
            this.managerNS.to(userId).emit('hostfilelist', hostFilelist);
        });
        // 规则文件列表
        this.ruleService.on("data-change", (userId, ruleFilelist) => {
            this.managerNS.to(userId).emit('rulefilelist', ruleFilelist);
        });
        // mock文件列表
        this.mockDataService.on("data-change", (userId, dataFilelist) => {
            this.managerNS.to(userId).emit('datalist', dataFilelist);
        });
        // 过滤器
        this.filterService.on("data-change", (userId, filters) => {
            this.managerNS.to(userId).emit('filters', filters);
        });
    }

    _getUserId(socketIOConn: SocketIO.Socket) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie || "");
        return cookies['userId'] || 'root';
    }

}
