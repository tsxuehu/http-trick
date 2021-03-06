const path = require("path");
const EventEmitter = require("events");
const _ = require("lodash");
const ip = require('ip');
module.exports = class AppInfoService extends EventEmitter {

  constructor(single) {
    super();
    // 用户home目录
    let userHome = process.env.HOME || process.env.USERPROFILE;
    // proxy data存放目录
    this.proxyDataDir = path.join(userHome, ".http-trick");
    // app信息
    this.appInfo = {
      appName: 'Http-Trick',
      single,
      httpProxyPort: "",
      httpsProxyPort: "",
      socks5ProxyPort: "",
      dnsPort: "",
      webUiPort: "",
      startHttpProxy: true,
      startSocks5: true,
      startDns: false,
      pcIp: "",
    };

    this.appDir = path.join(__dirname, "../../");
  }

  start() {
    // 获取真实的ip
    this.setAppInfo({
      pcIp: ip.address()
    });
  }

  getAppName() {
    return this.appInfo.appName;
  }

  getAppDir() {
    return this.appDir;
  }

  /**
   * 设置app 运行信息
   * @param info
   */
  setAppInfo(info) {
    _.assign(this.appInfo, info);
    this.emit('data-change', this.appInfo);
  }

  /**
   * 是否是单用户模式
   * @returns {boolean|*}
   */
  isSingle() {
    return this.appInfo.single;
  }

  /**
   * 本地存放数据的目录
   * @returns {*}
   */
  getProxyDataDir() {
    return this.proxyDataDir;
  }

  /**
   * 真实的代理端口
   * @returns {string}
   */
  getHttpProxyPort() {
    return this.appInfo.httpProxyPort;
  }

  /**
   * 真实的代理端口
   * @returns {string}
   */
  getHttpsProxyPort() {
    return this.appInfo.httpsProxyPort;
  }

  /**
   * 设置正在运行的代理端口
   * @param proxyport
   */
  setHttpsProxyPort(httpsProxyPort) {
    this.setAppInfo({
      httpsProxyPort: httpsProxyPort
    });
  }

  /**
   * 获取机器ip
   * @returns {string}
   */
  getPcIp() {
    return this.appInfo.pcIp;
  }

  getAppInfo() {
    return this.appInfo;
  }

  // 是否是webui请求
  isWebUiRequest(hostname, port) {
    return (hostname == '127.0.0.1' || hostname == this.appInfo.pcIp)
      && port == this.appInfo.webUiPort;
  }

  printRuntimeInfo() {
    let {
      appName,
      single,
      httpProxyPort,
      httpsProxyPort,
      socks5ProxyPort,
      dnsPort,
      webUiPort,
      startHttpProxy,
      startSocks5,
      startDns,
      pcIp,
    } = this.appInfo;
    startHttpProxy && console.log(`Http Proxy Port: ${ httpProxyPort}`);
    startSocks5 && console.log(`Socks5 Proxy Port: ${ socks5ProxyPort}`);
    startDns && console.log(`DNS Port: ${ dnsPort}`);
    console.log(`IP: ${ pcIp}`);
    console.log(`Manager: http://${pcIp}:${webUiPort}`);
  }
};
