import './module-hack'
import 'reflect-metadata'
import {configureLogger} from "config/log4js";
import {initAsyncContext} from "utils/trace";
import {registerGlobalExceptionHandler} from "./global-exception";
import path from "path";
import {Container} from "@spring4js/container-node";
import {setContainer} from "utils/global-var";
import glob from 'fast-glob';
import AppInfoService from "service/AppInfoService";
import HostDataService from "service/manage/HostDataService";
import ProfileService from "service/manage/ProfileService";
import FilterService from "service/manage/FilterService";
import RuleDataService from "service/manage/RuleDataService";
import MockDataService from "service/manage/MockDataService";
import ConfigureService from "service/manage/ConfigureService";
import CertificationService from "service/manage/CertificationService";
import HttpTrafficService from "service/intercept/HttpTrafficService";
import ip from 'ip';
import WsProcessService from "service/intercept/handler/WsProcessService";
import HttpsProxyServer from "./access/http-proxy/HttpsProxyServer";
import HttpProxyServer from "./access/http-proxy/HttpProxyServer";
import UiServer from "./access/ui-server/UiServer";
import getPort from "get-port";
import isObject from "lodash/isObject";
import ActionService from "service/intercept/ActionService";

export interface IStartOptions {
    httpProxyPort: number
    socks5ProxyPort: number
    dnsPort: number
    webUiPort: number
    userMode: string
}

export async function startProxy(options: IStartOptions) {
    // =======================================================================================
    // 初始化容器
    const container = new Container();
    const dirList = [
        path.resolve(__dirname, 'controller'),
        path.resolve(__dirname, 'service'),
        path.resolve(__dirname, 'access'),
    ];
    for (const dir of dirList) {
        const jsFileList: string[] = await glob(['**/*.js'], {
            cwd: dir,
        });
        for (const jsFile of jsFileList) {
            const obj: any = require(path.join(dir, jsFile));
            // @ts-ignore
            if (!isObject(obj) || !isObject(obj.default)) {
                continue;
            }
            // @ts-ignore
            const clazz = <IServiceClazz>obj.default;
            clazz.jsFile = jsFile;
            container.registerServiceClazz(clazz);
        }
    }

    // 挂载到全局
    setContainer(container);

    // =======================================================================================
    // 运行状态信息
    const appInfoService = await container.getServiceInstance<AppInfoService>(AppInfoService);
    await appInfoService.start(); // 初始化配置目录

    // 初始化 日志，上下文，全局异常处理
    configureLogger(path.resolve(appInfoService.getProxyDataDir(), 'logs'));
    initAsyncContext();
    registerGlobalExceptionHandler();


    // ========================================================================================
    // 初始化服务
    const configureService = await container.getServiceInstance<ConfigureService>(ConfigureService);
    const profileService = await container.getServiceInstance<ProfileService>(ProfileService);
    const hostService = await container.getServiceInstance<HostDataService>(HostDataService);
    const filterService = await container.getServiceInstance<FilterService>(FilterService);
    const ruleService = await container.getServiceInstance<RuleDataService>(RuleDataService);
    const mockDataService = await container.getServiceInstance<MockDataService>(MockDataService);
    const certificationService = await container.getServiceInstance<CertificationService>(CertificationService);

    await configureService.start();
    await profileService.start();
    await hostService.start();
    await filterService.start();
    await ruleService.start();
    await mockDataService.start();
    await certificationService.start();

    // =======================================================================================
    // 初始化代理服务器信息
    const httpProxyPort = options.httpProxyPort || configureService.getConfigure().httpProxyPort;
    const socks5ProxyPort = options.socks5ProxyPort || configureService.getConfigure().socks5ProxyPort;
    const webUiPort = options.webUiPort || configureService.getConfigure().webUiPort;
    const dnsPort = options.dnsPort || configureService.getConfigure().dnsPort;
    const httpsProxyPort = await getPort({port: 40005});
    appInfoService.setAppInfo({
        single: options.userMode != 'multi',
        pcIp: ip.address(),
        httpProxyPort,
        socks5ProxyPort,
        dnsPort,
        httpsProxyPort,
        webUiPort,
        startHttpProxy: true
    })

    // =======================================================================================
    // 初始化server处理器
    const wsProcessService = await container.getServiceInstance<WsProcessService>(WsProcessService);
    const httpTrafficService = await container.getServiceInstance<HttpTrafficService>(HttpTrafficService);
    const actionService = await container.getServiceInstance<ActionService>(ActionService);

    await wsProcessService.start();
    await httpTrafficService.start();
    await actionService.start();
    // 启动server
    const httpProxyServer = await container.getServiceInstance<HttpProxyServer>(HttpProxyServer);
    const httpsProxyServer = await container.getServiceInstance<HttpsProxyServer>(HttpsProxyServer);
    const uiServer = await container.getServiceInstance<UiServer>(UiServer);
    await httpProxyServer.start();
    await httpsProxyServer.start();
    await uiServer.start();

    appInfoService.printRuntimeInfo();
}

