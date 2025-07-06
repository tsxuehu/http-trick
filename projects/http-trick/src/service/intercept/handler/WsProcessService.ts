import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import FileService from "service/infra/FileService";
import log4js from "log4js";
import ProfileService from "service/manage/ProfileService";
import HostDataService from "service/manage/HostDataService";
import HttpProxy from 'http-proxy'
import {IncomingMessage} from "http";
import net from "net";
import HostResolveService from "service/intercept/HostResolveService";
import ConnectHandle from "service/intercept/handler/ConnectProcessService";
import tls from "tls";
import {IConnectInfo} from "service/intercept/host-resolve";

const logger = log4js.getLogger('WsProcessService')

@Service()
export default class WsProcessService {
    @Resource() private appInfoService: AppInfoService
    @Resource() private connectHandle: ConnectHandle
    @Resource() private profileService: ProfileService
    @Resource() private hostResolveService: HostResolveService

    private proxy: HttpProxy

    async start() {
        this.proxy = HttpProxy.createProxyServer({
            secure: false, // http-proxy api  在request的option里设置 rejectUnauthorized = false
            ws: true,
        });
        this._registHandleForWSProxy(this.proxy);
    }

    // websocket请求转发 ws测试服务器ws://echo.websocket.org/
    async handle(req: IncomingMessage, socket: net.Socket | tls.TLSSocket, head: Buffer) {

        const socks5Id = (socket as any).socks5Id;
        let connectInfo: IConnectInfo;
        if (socks5Id) { // socks5协议
            // 通过socks5信息 获取
            connectInfo = this.hostResolveService.getHttpProxyConnectInfo(socket.remotePort)
        } else {// http代理协议
            connectInfo = this.hostResolveService.getHttpProxyConnectInfo(socket.remotePort)
        }
        const targetHost = connectInfo.targetHost
        const targetPort = connectInfo.targetPort
        const deviceId = connectInfo.deviceId
        const userId = connectInfo.userId
        const isTls = (socket as tls.TLSSocket).encrypted

        let ip;
        try {
            ip = await this.hostResolveService.resolveHostDirect(userId, targetHost, deviceId);
        } catch (err) {
            logger.error('websocket connect error', targetHost);
        }
        // 转发websocket请求
        this.proxy.ws(req, socket, head, {
            target: {
                protocol: isTls ? 'https' : 'http',
                // hostname: ip,
                host: ip,
                port: +targetPort
            }
        });
    }

    _registHandleForWSProxy(proxy: HttpProxy) {
        proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {

        });
        proxy.on('open', (proxySocket) => {

        });
        proxy.on('close', (proxyRes, proxySocket, proxyHead) => {

        });
        proxy.on('error', (err, req, socket) => {
            logger.error('websocket proxy server error', err.message);
        });
    }
}
