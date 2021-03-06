const Action = require("./action");
const _ = require("lodash");
const ServiceRegistry = require("../../../service");
const Local = require("../../../utils/local");
const toClientResponseUtils = require("../../../utils/toClientResponseUtils");
const url = require("url");
const Remote = require("../../../utils/remote");
const addHeaderToResponse = require("../../../utils/addHeaderToResponse");
const cookie2Str = require("../../../utils/cookie2Str");
const queryString = require("query-string");
const cookie = require("cookie");

/**
 * 重定向 本地 或者 远程
 */
let redirect;
module.exports = class Redirect extends Action {
  static getInstance() {
    if (!redirect) {
      redirect = new Redirect();
    }
    return redirect;
  }

  constructor() {
    super();
    this.hostService = ServiceRegistry.getHostService();
    this.profileService = ServiceRegistry.getProfileService();
    this.remote = Remote.getInstance();
    this.local = Local.getInstance();
  }

  needRequestContent() {
    return false;
  }

  needResponse() {
    return false;
  }

  willGetContent() {
    return true;
  }

  /**
   * 运行处理动作
   */
  async run({
              req,
              res,
              recordResponse,
              urlObj,
              clientIp,
              deviceId,
              userId,
              rule, // 规则
              action, // 规则里的一个动作
              requestContent, // 请求内容
              additionalRequestHeaders, // 请求头
              actualRequestHeaders,
              additionalRequestQuery, // query
              actualRequestQuery,
              additionalRequestCookies, // cookie
              actualRequestCookies,
              toClientResponse, //响应内容
              last = true
            }) {
    //================== 转发到本地 或远程
    let {href} = urlObj;
    let target = '';
    // 解析目标
    try {
      target = this.profileService.calcPath(userId, href, rule.match, action.data.target);
      if (!target) {
        throw new Error("target parse empty ");
      }
    } catch (e) {
      toClientResponseUtils.setError(toClientResponse, action.data.target, e);
      return;
    }
    // 远程
    if (target.startsWith('http')) {
      await this._toRemote({
        req,
        res,
        recordResponse,
        clientIp,
        deviceId,
        target,
        additionalRequestHeaders, // 请求头
        actualRequestHeaders,
        additionalRequestQuery, // query
        actualRequestQuery,
        additionalRequestCookies, // cookie
        actualRequestCookies,
        toClientResponse,
        last
      });
    } else {// 本地文件
      await this._toLocal({
        req,
        res,
        clientIp,
        target,
        rule,
        action,
        requestContent,
        additionalRequestHeaders,
        toClientResponse,
        last
      });
    }
  }

  async _toRemote({
                    req,
                    res,
                    recordResponse,
                    clientIp,
                    deviceId,
                    userId,
                    target,
                    additionalRequestHeaders, // 请求头
                    actualRequestHeaders,
                    additionalRequestQuery, // query
                    actualRequestQuery,
                    additionalRequestCookies, // cookie
                    actualRequestCookies,
                    toClientResponse, //响应内容
                    last
                  }) {
    let redirectUrlObj = url.parse(target);
    let {protocol, hostname, path, port, query} = redirectUrlObj;

    // 构造path
    try {
      let originQuery = queryString.parse(query);
      Object.assign(actualRequestQuery, originQuery);
      if (Object.keys(additionalRequestQuery).length > 0) {
        Object.assign(actualRequestQuery, additionalRequestQuery);
        path = `${pathname}?${queryString.stringify(actualRequestQuery)}`;
      }
    } catch (e) {
    }

    // dns解析
    toClientResponse.dnsResolveBeginTime = Date.now();
    let ip = '';
    let resolveWay = '';
    try {
      let result = await this.hostService.resolveHostWithWay(userId, deviceId, hostname);
      resolveWay = result.way;
      ip = result.ip;
    } catch (e) {
      let href = `${protocol}//${hostname}:${port}${path}`;
      toClientResponseUtils.setError(toClientResponse, href, e);
      return;
    }
    toClientResponse.headers['proxy-remote-ip'] = ip;
    toClientResponse.headers['proxy-resolve-way'] = resolveWay;
    toClientResponse.remoteIp = ip;

    port = port || ('https:' == protocol ? 443 : 80);

    let targetUrl = '';
    if ((protocol == 'https:' && port == 443) || (protocol == 'http:' && port == 80)) {
      targetUrl = protocol + '//' + ip + path;
    } else {
      targetUrl = protocol + '//' + ip + ':' + port + path;
    }

    toClientResponse.headers['proxy-content'] = encodeURI(targetUrl);

    Object.assign(actualRequestHeaders, req.headers);
    // actualRequestHeaders['host'] = hostname;
    Object.assign(actualRequestHeaders, additionalRequestHeaders);
    // cookie设置

    if (Object.keys(additionalRequestCookies).length > 0) {
      let originCookies = cookie.parse(req.headers.cookie || "");
      Object.assign(actualRequestCookies, originCookies, additionalRequestCookies);
      actualRequestHeaders.cookie = cookie2Str(actualRequestCookies);
    } else {
      actualRequestHeaders.cookie = req.headers.cookie || "";
    }

    // 判断是否需要proxy
    let {hasExternalProxy, proxyType, proxyIp, proxyPort} = this.profileService.getExternalProxy(userId, deviceId);
    if (hasExternalProxy) {
      // 运行信息可以在下一个proxy中查看
      Object.assign(actualRequestHeaders, toClientResponse.headers);
    }

    if (last) {
      addHeaderToResponse(res, toClientResponse.headers);
      await this.remote.pipe({
        req,
        res,
        recordResponse,
        method: req.method,
        protocol,
        hostname,
        ip,
        path,
        port,
        headers: actualRequestHeaders,
        toClientResponse,
        hasExternalProxy, proxyType, proxyIp, proxyPort
      });
    } else {
      await this.remote.cache({
        req, res,
        method: req.method,
        protocol, hostname, ip, path, port,
        headers: actualRequestHeaders, toClientResponse,
        hasExternalProxy, proxyType, proxyIp, proxyPort
      });
    }
  }

  async _toLocal({
                   req,
                   res,
                   recordResponse,
                   urlObj,
                   clientIp,
                   target,
                   rule, // 规则
                   action, // 规则里的一个动作
                   requestContent, // 请求内容
                   additionalRequestHeaders, // 请求头
                   toClientResponse, //响应内容
                   last
                 }) {

    toClientResponse.headers['proxy-content'] = encodeURI(target);
    if (last) {
      toClientResponse.sendedToClient = true;
      addHeaderToResponse(res, toClientResponse.headers);
      await this.local.pipe({
        req,
        res,
        path: target,
        toClientResponse
      });
    } else {
      await this.local.cache({
        req,
        res,
        path: target,
        toClientResponse
      });
    }
  }
};
