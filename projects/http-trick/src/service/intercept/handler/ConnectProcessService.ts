import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import log4js from "log4js";
import net, {AddressInfo} from "net";
import {IncomingMessage} from "http";

const logger = log4js.getLogger("ConnectHandle");

// https ws wss 都会发送connect请求
// 代理服务器的目的只要抓取http https请求
// 折中方案：抓取所有的http请求、端口号为443的https请求
@Service()
export default class ConnectHandle {

    @Resource() private appInfoService: AppInfoService

    // 对于https协议，client connect请求proxy proxy和https server建立链接
    // 此字段记录proxy 请求内部https server链接 和 client的ip 之间的映射关系
    // 方便 https server 处理请求时，能够找出对应的client ip
    private connectionClientIpMap: Record<number, string> = {};


    getProxyRequestPortMapedClientIp(requestPort: number) {
        return this.connectionClientIpMap[requestPort];
    }

    async handle(req: IncomingMessage, socket: net.Socket, head: Buffer) {

        const httpProxyPort = this.appInfoService.getHttpProxyPort();
        const httpsProxyPort = this.appInfoService.getHttpsProxyPort();

        let proxyHost = "127.0.0.1";
        let proxyPort;

        // connect请求时 如何判断连到的目标机器是不是https协议？
        // ws、wss、https协议都会发送connect请求
        let [host, targetPort] = req.url.split(":");

        if ((+targetPort) == 443) {
            proxyPort = +httpsProxyPort;
        } else { // 非443则放行,连到http服务器上
            //proxyHost = host;// ws协议直接和远程服务器链接
            proxyPort = +httpProxyPort;
        }
        let requestPort: number = 0;
        let timeoutCheck: any;
        // 和远程建立链接 并告诉客户端
        let conn = net.connect(proxyPort, proxyHost, () => {
            clearTimeout(timeoutCheck);
            // 记录发出请求端口 和 远程ip的映射关系
            const {port} = conn.address() as AddressInfo;
            requestPort = port;
            this.connectionClientIpMap[port] = socket.remoteAddress;
            socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'utf8', function () {
                conn.pipe(socket);
                socket.pipe(conn);
            });
        });

        timeoutCheck = setTimeout(() => {
            logger.error("connect to + " + proxyHost + " : " + proxyPort + " timeout");
            if (!socket.destroyed) {
                socket.write('HTTP/' + req.httpVersion + ' 403 OK\r\n\r\n', 'utf8', function () {
                    socket.destroy();
                });
            }
            if (!conn.destroyed) {
                conn.destroy();
            }
        }, 1000);

        conn.on("error", e => {
            clearTimeout(timeoutCheck);
            logger.error("err when connect to + " + proxyHost + " : " + proxyPort);
            if (!socket.destroyed) {
                socket.write('HTTP/' + req.httpVersion + ' 403 OK\r\n\r\n', 'utf8', function () {
                    socket.destroy();
                });
            }
            delete this.connectionClientIpMap[requestPort];
        });
        conn.on("close", e => {
            if (!socket.destroyed) {
                socket.destroy();
            }
            delete this.connectionClientIpMap[requestPort];
        });
        socket.on("error", e => {
            clearTimeout(timeoutCheck);
            if (!conn.destroyed) {
                conn.destroy();
            }
        })
        socket.on("close", e => {
            if (!conn.destroyed) {
                conn.destroy();
            }
        })

    }
}