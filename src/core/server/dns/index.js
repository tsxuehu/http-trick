const dgram = require('dgram')
const NDP = require('native-dns-packet');
const DNSUtils = require('./utils');
const ServiceRegistry = require("../../service/index");

// DNS服务器
module.exports = class DnsServer {
  constructor({
                port = 53,
              }) {
    this.port = port;
    this.profileService = ServiceRegistry.getProfileService();
    this.dnsMockService = ServiceRegistry.getDnsMockService();
    this.configureService = ServiceRegistry.getConfigureService();
    this.logService = ServiceRegistry.getLogService();
  }

  async start() {
    let server = this.server = dgram.createSocket('udp4')
    server.on('error', error => {
      this.logService.error(error)
    });

    server.on('listening', server => {
      this.logService.info('DNS service has started')
    });

    server.on('message', (message, rinfo) => {
      this._handleRequest(message, rinfo);
    });

    this.server.bind(this.port);
  }

  _handleRequest(message, rinfo) {
    const server = this.server;
    const query = NDP.parse(message);
    let domain = query.question[0].name;
    // 检查domain是否需要mock
    let can = this.profileService.shoudGoThrougProxy('root', domain);
    if (can) { // 返回mock的Ip

      let ip = this.dnsMockService.getMockIp(domain);
      let response = new NDP();
      response.header.id = query.header.id;
      response.header.qr = 1;
      response.question = query.question;
      response.answer.push(DNSUtils.A({
        name: domain,
        address: ip,
        ttl: 600,
      }));
      let buff = Buffer.alloc(512);
      NDP.write(buff, response);
      // 向用户端发送数据
      server.send(buff, 0, buff.length, rinfo.port, rinfo.address);

    } else { // 查询远端DnsServer

      let remoteDnsServer = this.configureService.getRemoteDnsServer();
      let proxySoket = dgram.createSocket('udp4');

      proxySoket.on('error', err => {
        this.logService.error(error)
      });

      proxySoket.on('message', responseBuf => {
        // 向用户端发送数据
        server.send(responseBuf, 0, responseBuf.length, rinfo.port, rinfo.address);
        proxySoket.close()
      });

      proxySoket.send(message, 0, message.length, 53, remoteDnsServer);

    }
  }
};
