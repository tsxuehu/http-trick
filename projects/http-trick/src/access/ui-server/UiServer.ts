import log4js from 'log4js'
import Router from '@koa/router'
import http, {Server} from "http";
import Koa, {Context, Next} from 'koa'
import SocketIO from 'socket.io'
import koa from "koa";
import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import {getRemoteIp} from "../../utils/socket-ip";
import koaQs from "koa-qs"
import staticServe from "koa-static";
import path from "path";
import koaBody from "koa-body";
import cookieParser from "cookie";
import ConfigureService from "service/manage/ConfigureService";
import ProfileService from "service/manage/ProfileService";
import HostDataService from "service/manage/HostDataService";
import FilterService from "service/manage/FilterService";
import RuleDataService from "service/manage/RuleDataService";
import MockDataService from "service/manage/MockDataService";
import {runInAsyncContext} from "utils/trace";
import {getContainer} from "../../utils/global-var";
import HttpTrafficService from "service/intercept/HttpTrafficService";

const logger = log4js.getLogger('UiServer')


@Service()
export default class UiServer {
    @Resource() private appInfoService: AppInfoService
    @Resource() private configureService: ConfigureService
    @Resource() private profileService: ProfileService
    @Resource() private hostDataService: HostDataService
    @Resource() private filterService: FilterService
    @Resource() private ruleDataService: RuleDataService
    @Resource() private mockDataService: MockDataService
    @Resource() private httpTrafficService: HttpTrafficService

    private server: Server
    private app: Koa
    private io: SocketIO.Server

    async start() {
        this.app = new koa();
        this.app.use(async (ctx: Context, next: Next) => {
            await runInAsyncContext('ui-server', async () => {
                const startTime = Date.now()
                logger.info(`收到请求 ${ctx.method} ${ctx.href}`)
                try {
                    await next();
                } catch (err) {
                    logger.error(`请求出错`, err)
                } finally {
                    const endTime = Date.now()
                    logger.info(`处理完成 耗时 ${(endTime - startTime) / 1000}s`)
                }
            })
        });
        // 身份识别
        this.app.use(async (ctx, next) => {
            let userId = 'root';
            if (!this.appInfoService.isSingle()) {
                let cookies = cookieParser.parse(ctx.request.headers.cookie || "");
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
        const port = this.appInfoService.getWebUiPort();
        this.server.listen(port);
    }

    async assembleRouter() {
        let router = new Router()
        const container = getContainer()
        let routerList = container.getRouterInfo()
        for (let routerInfo of routerList) {
            let {httpMethod, requestPath, serviceName, functionName} = routerInfo
            logger.info(`注册路由 ${httpMethod} ${requestPath}`)
            let instance = await container.getServiceInstance(serviceName)
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
        const httpTraficMonitorNS = this.io.of('/httptrafic');
        // 客户端发起连接请求
        httpTraficMonitorNS.on('connection', async client => {

            let userId = this._getUserId(client);
            client.join(userId);

            this.httpTrafficService.incMonitor(userId);

            let deviceList = this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
            // host文件列表
            let hostFileList = this.hostDataService.getHostFileList(userId);
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
            httpTraficMonitorNS.to(userId).emit('rows', rows);
        });
        // 过滤器改变
        this.httpTrafficService.on('filter', (userId, filter) => {
            httpTraficMonitorNS.to(userId).emit('filter', filter);
        });
        // 状态改变
        this.httpTrafficService.on('state-change', (userId, state) => {
            httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 清空
        this.httpTrafficService.on('clear', (userId) => {
            httpTraficMonitorNS.to(userId).emit('clear');
            let state = this.httpTrafficService.getStatus(userId);
            httpTraficMonitorNS.to(userId).emit('state', state);
        });
        // 推送设备列表信息
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            httpTraficMonitorNS.to(userId).emit('bindedDeviceList', deviceList);
        });

        // host文件变化
        this.hostDataService.on("data-change", (userId, hostFilelist) => {
            httpTraficMonitorNS.to(userId).emit('hostfilelist', hostFilelist);
        });
    }

    // 管理界面 使用的功能
    _initManager() {
        const managerNS = this.io!.of('/manager');

        // 注册通知
        managerNS.on('connection', async client => {
            // 监听内部状态的客户端,这些客户端获取当前生效的host、rule
            let userId = this._getUserId(client);
            client.join(userId);
            // 推送最新数据
            // 运行信息
            let appInfo = this.appInfoService.getAppInfo();
            client.emit('appinfo', appInfo);
            // proxy配置
            let config = this.configureService.getConfigure();
            client.emit('configure', config);
            // 个人配置
            let profile = this.profileService.getProfile(userId);
            client.emit('profile', profile);
            let deviceList = this.profileService.getDeviceListBindedToUserId(userId);
            client.emit('bindedDeviceList', deviceList);
            // host文件列表
            let hostFileList = this.hostDataService.getHostFileList(userId);
            client.emit('hostfilelist', hostFileList);
            // 规则列表
            let ruleFileList = this.ruleDataService.getRuleFileList(userId);
            client.emit('rulefilelist', ruleFileList);
            // 数据文件列表
            let dataList = this.mockDataService.getMockDataList(userId);
            client.emit('datalist', dataList);
            // 过滤器
            let filters = this.filterService.getFilterRuleList(userId);
            client.emit('filters', filters);
        });
        // proxy配置信息
        this.configureService.on("data-change", (userId, configure) => {
            managerNS.to(userId).emit('configure', configure);
        });
        // 个人配置信息
        this.profileService.on("data-change-profile", (userId, profile) => {
            managerNS.to(userId).emit('profile', profile);
        });
        this.profileService.on("data-change-deviceList", (userId, deviceList) => {
            managerNS.to(userId).emit('bindedDeviceList', deviceList);
        });
        // host文件变化
        this.hostDataService.on("data-change", (userId, hostFilelist) => {
            managerNS.to(userId).emit('hostfilelist', hostFilelist);
        });
        // 规则文件列表
        this.ruleDataService.on("data-change", (userId, ruleFilelist) => {
            managerNS.to(userId).emit('rulefilelist', ruleFilelist);
        });
        // mock文件列表
        this.mockDataService.on("data-change", (userId, dataFilelist) => {
            managerNS.to(userId).emit('datalist', dataFilelist);
        });
        // 过滤器
        this.filterService.on("data-change", (userId, filters) => {
            managerNS.to(userId).emit('filters', filters);
        });
    }

    _getUserId(socketIOConn: SocketIO.Socket) {
        let cookies = cookieParser.parse(socketIOConn.request.headers.cookie || "");
        return cookies['userId'] || 'root';
    }

}
