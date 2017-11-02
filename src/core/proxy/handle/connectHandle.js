const net = require("net");
const ServiceRegistry = require("../../service");

let connectHandle = null;
// https ws wss 都会发送connect请求
// 代理服务器的目的只要抓取http https请求
// 折中方案：抓取所有的http请求、端口号为443的https请求
module.exports = class ConnectHandle {
    static getInstance(httpProxyPort, httpsProxyPort) {
        if (!connectHandle) {
            connectHandle = new ConnectHandle(httpProxyPort, httpsProxyPort);
        }
        return connectHandle;
    }

    constructor(httpProxyPort, httpsProxyPort) {
        this.httpProxyPort = httpProxyPort;
        this.httpsProxyPort = httpsProxyPort;
        this.logService = ServiceRegistry.getLogService();
    }

    handle(req, socket, head) {
        let proxyHost = "127.0.0.1";
        let proxyPort;

        // connect请求时 如何判断连到的目标机器是不是https协议？ 因为ws协议也会发送connect请求
        let targetPort = req.url.split(":")[1];
        if (targetPort == 443) {
            proxyPort = this.httpsProxyPort;
        } else { // 非443则放行,连到http服务器上
            proxyPort = this.httpProxyPort;
        }

        // 和远程建立链接 并告诉客户端
        let conn = net.connect(proxyPort, proxyHost, function () {
            socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8', function () {
                conn.pipe(socket);
                socket.pipe(conn);
            });
        });

        conn.on("error", function (e) {
            this.logService.error("ws err when connect to + " + proxyHost + " : " + proxyPort);
            this.logService.error(e);
        });
    }
}