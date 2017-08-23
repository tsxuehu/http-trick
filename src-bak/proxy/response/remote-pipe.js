/**
 * Created by tsxuehu on 17/3/31.
 */
// 获取远程内容返回给客户端

/**
 * 直接转发访问远程
 */
var dc = require('../../datacenter');
var httpProxy = require('http-proxy');
var url = require('url');
var proxyEvent = require('../../utils/proxyEvent');
var notify = require('../../notify');
var proxy = httpProxy.createProxyServer({
    proxyTimeout: dc.getRequestTimeoutTime(),
    secure: false // http-proxy api  在request的option里设置 rejectUnauthorized = false
});
/**
 * 为proxy注册事件处理函数
 */
proxyEvent.registHandleForHttpProxy(proxy);

/**
 * 透传给远端服务器
 * @param req
 * @param res
 * @param urlObj
 */
module.exports.pass = function ({req, res, urlObj, logKey, requestHeaders}) {
    // 将请求转发到mock
    // 设置超时时间，节约socket资源

    var host = dc.resolveHost(urlObj.hostname);
    var targetUrl = urlObj.protocol + '//' + host + ':' + urlObj.port + urlObj.path;
    res.setHeader(logKey || 'fe-proxy-action', encodeURI(targetUrl));

    proxy.web(req, res, {
        target: {
            protocol: urlObj.protocol,
            hostname: host,
            path: urlObj.path,
            port: urlObj.port
        },
        headers: Object.assign({
            "Host": urlObj.hostname
        }, requestHeaders),
        ignorePath: true,
    });
    return Promise.resolve(true);
};
/**
 * 重定向到另一个地址
 * @param req
 * @param res
 * @param target
 */
module.exports.redirect = function ({req, res, target, logKey, requestHeaders}) {
    var redirectUrlObj = url.parse(target);

    var host = dc.resolveHost(redirectUrlObj.hostname);
    var port = redirectUrlObj.port || ('https:' == redirectUrlObj.protocol ? 443 : 80);
    var targetUrl = redirectUrlObj.protocol + '//' + host + ':' + port + redirectUrlObj.path;
    res.setHeader(logKey || 'fe-proxy-action', encodeURI(targetUrl));
    // host 解析

    proxy.web(req, res, {
        target: {
            protocol: redirectUrlObj.protocol,
            hostname: host,
            path: redirectUrlObj.path,
            port: port
        },
        headers: Object.assign({
            "Host": redirectUrlObj.hostname
        }, requestHeaders),
        ignorePath: true, // 忽略原始path
    });
    return Promise.resolve(true);
};