
var dc = require('./datacenter');
var getPort = require('./utils/getPort');
var createHttpServer = require('./proxy/http-server');
var createHttpsServer = require('./proxy/https-server');
var startUiServer = require('./uiserver');
var opn = require('opn');
var ip = require('ip');
var pcIp = ip.address();
var sync = require('./sync');
dc.setPcIp(pcIp);

// 获得https请求拦截服务器的端口号
module.exports = function (httpPort) {
    // 如果不存在 则从datacenter取默认值
    if (!httpPort) {
        httpPort = dc.getConf().proxyPort;
    }
    // 记录运行时的代理端口
    dc.setRealProxyPort(httpPort);

    // 获取一个空闲端口，用于启动https拦截服务器
    getPort(function (httpsPort) {
        // 打印日志 proxy的运行端口
        createHttpServer(httpPort, httpsPort);
        createHttpsServer(httpPort, httpsPort);
    });
    // 获取空闲端口，启动管理界面服务器
    getPort(function (webuiPort) {
        console.log('Zan proxy port: ' + httpPort);
        console.log('Zan proxy 配置页面地址：' + 'http://' + pcIp + ':' + webuiPort);
        // 设置运行时的用户界面端口
        dc.setRealUiPort(webuiPort);
        // 启动web ui
        startUiServer.startUiServer(webuiPort);
        opn('http://' + pcIp + ':' + webuiPort);
    });
    // 启动远程文件更新检查
    sync.start();
};