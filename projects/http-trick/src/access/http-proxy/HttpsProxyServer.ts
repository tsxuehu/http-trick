import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import ConnectProcessService from "service/intercept/handler/ConnectProcessService";
import HttpProcessService from "service/intercept/handler/HttpProcessService";
import WsProcessService from "service/intercept/handler/WsProcessService";
import CertificationService from "service/manage/CertificationService";

import https from 'https'
import tls, {SecureContext} from 'tls'
import {runInAsyncContext} from "../../utils/trace";
import net from "net";
import log4js from "log4js";

const logger = log4js.getLogger('HttpsProxyServer')
/**
 * 1、转发https请求
 * 2、转发wss请求
 */
@Service()
export default class HttpsProxyServer {
    @Resource() private appInfoService: AppInfoService
    @Resource() private connectProcessService: ConnectProcessService
    @Resource() private httpProcessService: HttpProcessService
    @Resource() private wsProcessService: WsProcessService
    @Resource() private certificationService: CertificationService

    private httpsProxyServer: https.Server;

    async start() {
        this.httpsProxyServer = https.createServer({
            SNICallback: (serverName, SNICallback) => {
                this.SNIPrepareCert(serverName, SNICallback)
            },
        });
        // 事件监听函数的this指针会被改变
        let that = this;

        this.httpsProxyServer.on('request', async (req, res) => {
            await runInAsyncContext('https-proxy-req', async () => {
                try {
                    await this.httpProcessService.handle(req, res)
                } catch (err) {
                    logger.error('request', err)
                }
            })
        });
        this.httpsProxyServer.on('upgrade', async (req, socket, head) => {
            await runInAsyncContext('https-proxy-up', async () => {
                try {
                    await this.wsProcessService.handle(req, socket as net.Socket, head)
                } catch (err) {
                    logger.error('request', err)
                }
            })
        });
        this.httpsProxyServer.on('error', function (err) {
            console.log(err);
            process.exit(0);
        });
        const port = this.appInfoService.getHttpsProxyPort();
        this.httpsProxyServer.listen(port, "0.0.0.0");
    }

    async SNIPrepareCert(serverName: string, SNICallback: (err: Error | null, ctx?: SecureContext) => void) {
        let {certPem, keyPem} = await this.certificationService.getHostSecurityContext(serverName);
        let ctx = tls.createSecureContext({
            key: keyPem,
            cert: certPem
        });
        SNICallback(null, ctx);
    }
};
