
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
var url = require('url');
var log = require('./log');
module.exports = function parseUrl(req) {
    var host = req.headers.host;
    var protocol = (!!req.connection.encrypted && !/^http:/.test(req.url)) ? "https" : "http";
    // http代理协议里 path部分会包含全路径 （如 GET http://www.baidu.com/ HTTP/1.0）
    var fullUrl = protocol === "http" ? req.url : (protocol + '://' + host + req.url);
    var urlObj = url.parse(fullUrl);
    urlObj.port = urlObj.port || (protocol == 'https'? 443 : 80);

    // if (fullUrl.indexOf(' ') > -1 || urlObj.hostname.indexOf(' ') > -1) {
    //     log.error('http request: url - ' + fullUrl);
    //     log.error(req);
    // }

    return urlObj;
}