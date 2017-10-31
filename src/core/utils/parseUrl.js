
/**
 * 从request里解析出url
 * {
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.youzan.com',
  port: null,
  hostname: 'www.youzan.com',
  hash: null,
  search: '?b=2',
  query: 'b=2',
  pathname: '/aa',
  path: '/aa?b=2',
  href: 'https://www.youzan.com/aa?b=2' }
 */
const url = require('url');
const log = require('./log');
module.exports =  function parseUrl(req) {
    var host = req.headers.host;
    var protocol = '';
    if (!req.connection.encrypted) {
        // http的代理协议 代理访问https请求 (小程序开发工具使用了这种方法代理https协议)
        if (/^https:/.test(req.url)) {
            protocol = "https";
        } else {
            protocol = "http";
        }
    } else {
        // 正常的https请求 url里只能读取到 path部分，http代理协议里才能读到完成的url
        if (!/^http:/.test(req.url)) {
            protocol = "https";
        } else {
            protocol = "http";
        }
    }
    var fullUrl = "";
    // http代理协议 代理http请求，  http协议代理https请求
    if (protocol == 'http' || /^https:/.test(req.url)){
        fullUrl = req.url;
    } else {
        fullUrl = protocol + '://' + host + req.url;
    }

    var urlObj = url.parse(fullUrl);
    urlObj.port = urlObj.port || (protocol == 'https' ? 443 : 80);

    return urlObj;
}
