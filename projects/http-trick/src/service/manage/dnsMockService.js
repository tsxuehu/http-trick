const randomIpv4 = require('random-ipv4');

// dns mock ip 服务, 用于socks5代理，只有mock的域名进入 http解析
module.exports = class DnsMockService {

  constructor(single) {
    this.reset();
  }

  async start() {

  }

  reset() {
    this._dnsHostIpCache = {};
    this._dnsIpHostCache = {};
  }

  getMockIp(domain) {
    let cachedIp = this._dnsHostIpCache[domain];
    if (cachedIp) {
      return cachedIp;
    }

    while (true) {
      let ip = randomIpv4('198.18.{token}.{token}');
      if (!this._dnsIpHostCache[ip]) {
        this._dnsIpHostCache[ip] = domain;
        this._dnsHostIpCache[domain] = ip;
        return ip;
      }
    }
  }

  // 如果是mockIp 返回mockIp对应的域名
  resolveMockedDomain(mockIp) {
    return this._dnsIpHostCache[mockIp];
  }

};
