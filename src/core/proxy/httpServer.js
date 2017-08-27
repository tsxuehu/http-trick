/**
 * Created by tsxuehu on 8/22/17.
 */

import http from "http";
import HttpHandle from "./handle/httpHandle";
import ConnectHandle from "./handle/connectHandle";
import WsHandle from "./handle/wsHandle";


/**
 * 1、接受浏览器发出的connect请求（ws、wss、https）
 * 2、转发http请求
 * 3、转发 ws请求
 */
export default class HttpServer {
    constructor(httpPort, httpsPort) {
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
    }

    start() {
        //creat proxy server
        this.httpProxyServer = http.createServer(HttpHandle.getHttpHandle().handle);
        // handle CONNECT request for https over http
        this.httpProxyServer.on('connect', ConnectHandle.getHandle(this.httpPort, this.httpsPort).handle);
        // websocket 请求处理
        this.httpProxyServer.on('upgrade', WsHandle.getWsHandle().handle);
        //start proxy server 捕获端口冲突

        this.httpProxyServer.on('error', function (err) {
            console.log(err);
            process.exit(0);
        });

        this.httpProxyServer.listen(httpProxyPort, "0.0.0.0");
    }
}