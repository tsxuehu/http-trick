import {Resource, Service} from "@spring4js/container-node";
import AppInfoService from "service/AppInfoService";

import http from 'http'
import ConnectProcessService from "service/intercept/handler/ConnectProcessService";
import HttpProcessService from "service/intercept/handler/HttpProcessService";
import WsProcessService from "service/intercept/handler/WsProcessService";
import {runInAsyncContext} from "../../utils/trace";
import log4js from "log4js";
import net from "net";

const logger = log4js.getLogger('HttpProxyServer')
/**
 * 1、接受浏览器发出的connect请求（ws、wss、https）
 * 2、转发http请求
 * 3、转发 ws请求
 */
@Service()
export default class HttpProxyServer {
    @Resource() private appInfoService: AppInfoService
    @Resource() private connectProcessService: ConnectProcessService
    @Resource() private httpProcessService: HttpProcessService
    @Resource() private wsProcessService: WsProcessService

    private httpProxyServer: http.Server

    async start() {
        //creat proxy server
        this.httpProxyServer = http.createServer();
        // 事件监听函数的this指针会被改变
        let that = this;
        // request handle
        this.httpProxyServer.on('request', async (req, res) => {
            await runInAsyncContext('http-proxy-req', async () => {
                try {
                    await this.httpProcessService.handle(req, res)
                } catch (err) {
                    logger.error('request', err)
                }
            })
        });
        // handle CONNECT request for https over http
        this.httpProxyServer.on('connect', async (req, socket, head) => {
            await runInAsyncContext('http-proxy-con', async () => {
                try {
                    await this.connectProcessService.handle(req, socket as net.Socket, head)
                } catch (err) {
                    logger.error('request', err)
                }
            })
        });
        // websocket 请求处理
        this.httpProxyServer.on('upgrade', async (req, socket, head) => {
            await runInAsyncContext('http-proxy-up', async () => {
                try {
                    await this.wsProcessService.handle(req, socket as net.Socket, head)
                } catch (err) {
                    logger.error('request', err)
                }
            })
        });
        //start proxy server 捕获端口冲突
        this.httpProxyServer.on('error', (err) => {
            console.log(err);
            process.exit(0);
        });
        const port = this.appInfoService.getHttpProxyPort();
        this.httpProxyServer.listen(port, "0.0.0.0");
    }
};
