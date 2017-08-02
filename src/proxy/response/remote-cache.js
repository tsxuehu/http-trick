/**
 * Created by tsxuehu on 17/3/31.
 */
// 获取远程内容返回给客户端

/**
 * 直接转发访问远程
 */
var dc = require('../../datacenter');
var url = require('url');
var axios = require('axios');

/**
 * 透传给远端服务器
 * @param req
 * @param res
 * @param urlObj
 */
module.exports.pass = function ({req, res, urlObj, logKey, requestHeaders, toSendResponse}) {
    // 设置超时时间，节约socket资源
    var host = dc.resolveHost(urlObj.hostname);
    var targetUrl = urlObj.protocol + '//' + host + ':' + urlObj.port + urlObj.path;

    return Promise.resolve().then(() => {
        return axios({
            method: req.method,
            url: targetUrl,
            headers: Object.assign({
                Host: urlObj.hostname
            }, req.headers, requestHeaders),
            maxRedirects: 0,
            responseType: 'text',
            data: req
        });
    }).then(response => {
        toSendResponse.hasContent = true;
        toSendResponse.headers = Object.assign(toSendResponse.headers, response.headers);
        toSendResponse.body = response.data;
        toSendResponse.headers[logKey || 'fe-proxy-action'] = encodeURI(targetUrl);

        return false;
    });
};
/**
 * 重定向到另一个地址
 * @param req
 * @param res
 * @param target
 */
module.exports.redirect = function ({req, res, target, logKey, requestHeaders, toSendResponse}) {
    var redirectUrlObj = url.parse(target);

    var host = dc.resolveHost(redirectUrlObj.hostname);
    var port = redirectUrlObj.port || ('https:' == redirectUrlObj.protocol ? 443 : 80);
    var targetUrl = redirectUrlObj.protocol + '//' + host + ':' + port + redirectUrlObj.path;

    return Promise.resolve().then(() => {
        return axios({
            method: req.method,
            url: targetUrl,
            headers: Object.assign({}, req.headers, requestHeaders, {
                Host: host
            }),
            maxRedirects: 0,
            responseType: 'text',
            data: req
        });
    }).then(response => {
        toSendResponse.hasContent = true;
        toSendResponse.headers = Object.assign(toSendResponse.headers, response.headers);
        toSendResponse.body = response.data;
        toSendResponse.headers[logKey || 'fe-proxy-action'] = encodeURI(targetUrl);
        return false;
    });
};