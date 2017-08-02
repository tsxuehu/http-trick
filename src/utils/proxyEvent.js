
var requestLog = require('./log').getRequestLog();

/**
 * 为http proxy注册事件响应函数
 */
function registHandleForHttpProxy(proxy) {
    // 准备处理转发请求的事件
    proxy.on('start', function (req, res, url) {

    });

    // 代理和远程服务器简历socket链接
    proxy.on('proxyReq', function (proxyReq, req, res, options) {

    });

    // 远程服务器开始有响应事件
    proxy.on('proxyRes', function (proxyRes, req, res) {

    });

    // 远程服务器响应结束
    proxy.on('end', function (req, res, proxyRes) {

    });

    //  req.on('error', proxyError);
    //  proxyReq.on('error', proxyError);
    // 一般性异常，  req和 httpclient抛出的异常
    // 异常时 打印vm的运行状态
    proxy.on('error', function (err, req, res, url,source) {
        requestLog.error(req.urlObj.id +' '+ source+ ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' error');
        if (res.headersSent) return;
        res.statusCode = 500;
        res.setHeader('Content-Length', 0);
        res.setHeader('Code', err.code);
      //  res.setHeader('Reason', err.message);
        res.end();
    });

    //  req.on('error', proxyError);
    //  proxyReq.on('error', proxyError);
    //  特殊异常： req.socket.destroyed && err.code === 'ECONNRESET'
    proxy.on('econnreset', function (err, req, res, url,source) {
        requestLog.error(req.urlObj.id +' '+ source + ' ' + req.urlObj.href + ' ' + err.code + ' ' + err.message + ' econnreset');
        if (res.headersSent) return;
        res.statusCode = 500;
        res.setHeader('Content-Length', 0);
        res.setHeader('Code', err.code);
      //  res.setHeader('Reason', err.message);
        res.end();
    });
}

function registHandleForWSProxy(proxy) {
    proxy.on('proxyReqWs', function ( proxyReq, req, socket, options, head) {

    });
    proxy.on('open', function (proxySocket) {

    });
    proxy.on('close', function (proxyRes, proxySocket, proxyHead) {

    });
    proxy.on('error', function ( err, req, socket) {
        requestLog.error(err);
    });
}

module.exports.registHandleForHttpProxy = registHandleForHttpProxy;
module.exports.registHandleForWSProxy = registHandleForWSProxy;