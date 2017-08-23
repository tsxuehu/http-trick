var http = require('http');
var httpHandler = require('./handle/http-handle');
var connectHandle = require('./handle/connect-handle');
var wsHandle = require('./handle/ws-handle');
var httpProxyServer;
/**
 * 启动http服务器
 */
module.exports = function createServer(httpProxyPort, httpsProxyPort) {
    //creat proxy server
    httpProxyServer = http.createServer(httpHandler);
    // handle CONNECT request for https over http
    httpProxyServer.on('connect',connectHandle(httpProxyPort, httpsProxyPort));
    // websocket 请求处理
    httpProxyServer.on('upgrade', wsHandle);
    //start proxy server 捕获端口冲突

    httpProxyServer.on('error', function (err) {
        console.log(err);
        process.exit(0);
    });

    httpProxyServer.listen(httpProxyPort);
}