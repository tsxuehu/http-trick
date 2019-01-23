const url = require("url");
const WsMock = require("../../wsmock/index");
const HttpProxy = require("http-proxy");
const ServiceRegistry = require("../../../service/index");
const getClientIp = require("../../../utils/getClientIp");

let wsHandle;
module.exports = class WsHandle {
    static getInstance() {
        if (!wsHandle) {
            wsHandle = new WsHandle();
        }
        return wsHandle;
    }

    constructor() {
        this.logService = ServiceRegistry.getLogService();
        this.hostService = ServiceRegistry.getHostService();
        this.profileService = ServiceRegistry.getProfileService();
        // 创建httpProxy
        this.proxy = HttpProxy.createProxyServer({
            secure: false // http-proxy api  在request的option里设置 rejectUnauthorized = false
        });
        this._registHandleForWSProxy(this.proxy);

        this.wsMock = WsMock.getInstance();
    }

    // websocket请求转发 ws测试服务器ws://echo.websocket.org/
    async handle(req, socket, head) {

        let clientIp = ''; // 设备ip
        let deviceId = '';// 设备id
        let userId = '';// 设备绑定的用户id
        let socks5proxy = req.socket.socks5;

        if (socks5proxy) { // socks5协议
            deviceId = req.socket.deviceId;
            clientIp = req.socket.clientIp;
            userId = req.socket.userId;
        } else {// http代理协议
            clientIp = getClientIp(req);
            deviceId = clientIp; // 将设备的ip当做设备的id
            userId = this.profileService.getUserIdBindDevice(deviceId);
        }

        // 分配ws mock终端，没有分配到终端的和远程建立连接，分配到mock终端的和mock终端通信
        let host = req.headers.host.split(':')[0];
        let port = req.headers.host.split(':')[1];
        let path = url.parse(req.url).path;
        let protocal = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http";


        let ip = await this.hostService.resolveHostDirect(userId, host, clientIp);
        console.log(ip, host, protocal, port || (protocal == 'http' ? 80 : 443));
        // 转发websocket请求
        this.proxy.ws(req, socket, head, {
            target: {
                protocol: protocal,
                hostname: ip,
                port: port || (protocal == 'http' ? 80 : 443)
            }
        });
    }

    _registHandleForWSProxy(proxy) {
        proxy.on('proxyReqWs',  (proxyReq, req, socket, options, head) => {

        });
        proxy.on('open',  (proxySocket) => {

        });
        proxy.on('close',  (proxyRes, proxySocket, proxyHead) => {

        });
        proxy.on('error',  (err, req, socket) => {
            this.logService.error(err);
        });
    }
}
