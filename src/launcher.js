const getPort = require("get-port");
const ServiceRegistry = require("./core/service/index");
const HttpServer = require("./core/server/http/httpServer");
const HttpsServer = require("./core/server/http/httpsServer");
const Socks5Server = require("./core/server/socks5/index");
const DnsServer = require("./core/server/dns/index");
const WebUiServer = require("./core/uiServer");

// 基于文件的service导入
const FileAppInfoService = require("./impl/file/appInfoService");
const FileCertificationService = require("./impl/file/certificationService");
const FileProfileService = require("./impl/file/profileService");
const FileConfigureService = require("./impl/file/configureService");
const FileFilterService = require("./impl/file/filterService");
const FileHostService = require("./impl/file/hostService");
const FileHttpTrafficService = require("./impl/file/httpTrafficService");
const FileLogService = require("./impl/file/logService");
const FileMockDataService = require("./impl/file/mockDataService");
const FileRuleService = require("./impl/file/ruleService");
const DnsMockService = require("./impl/file/dnsMockService");

module.exports = class Launcher {
  /**
   * @param port 代理端口号
   * @param serviceType 使用的服务类型
   * @param isSingle 是否是单用户模式
   */
  constructor({
                httpProxyPort,
                socks5ProxyPort,
                dnsPort,
                startDns, // 是否启动dns服务器
                startSocks5, // 是否启动socks服务器
                webUiPort,
                userMode = "single"
              }) {
    this.single = userMode != "multi";

    this.socks5ProxyPort = socks5ProxyPort;
    this.webUiPort = webUiPort;
    this.httpProxyPort = httpProxyPort;
    this.dnsPort = dnsPort;

    this.startDns = startDns;
    this.startSocks5 = startSocks5;
  }

  /**
   * 启动代理
   * @param port
   */
  async start() {
    await this._initService();
    this._setRuntimeInfo();
    await this._startProxyServer();
    await this._startWebUiServer();
    await this._startServiceMockServer();
  }

  // 初始化各种服务 并注册
  async _initService() {

    // 基础服务
    let logService = new FileLogService();
    let appInfoService = new FileAppInfoService(this.single);
    let configureService = new FileConfigureService({appInfoService});

    let baseService = {logService, appInfoService, configureService};

    let certificationService = new FileCertificationService(baseService);
    let profileService = new FileProfileService(baseService);
    let filterService = new FileFilterService({profileService, ...baseService});
    let hostService = new FileHostService({profileService, ...baseService});
    let httpTrafficService = new FileHttpTrafficService(baseService);
    let mockDataService = new FileMockDataService(baseService);
    let ruleService = new FileRuleService({profileService, ...baseService});
    let dnsMockService = new DnsMockService({profileService, ...baseService});


    // 启动服务
    await appInfoService.start();
    await certificationService.start();
    await configureService.start();
    await profileService.start();
    await filterService.start();
    await hostService.start();
    await httpTrafficService.start();
    await logService.start();
    await mockDataService.start();
    await ruleService.start();

    // 注册服务
    ServiceRegistry.registeServices({
      appInfoService,
      certificationService,
      profileService,
      configureService,
      filterService,
      hostService,
      httpTrafficService,
      logService,
      mockDataService,
      ruleService,
      dnsMockService
    });

  }

  _setRuntimeInfo() {
    // 如果不存在 则从配种中取默认值
    let configureService = ServiceRegistry.getConfigureService();
    let {
      httpProxyPort,
      socks5ProxyPort,
      dnsPort,
      webUiPort,
      startSocks5,
      startDns,
    } = configureService.getConfigure();

    if (this.httpProxyPort == undefined) {
      this.httpProxyPort = httpProxyPort;
    }
    if (this.socks5ProxyPort == undefined) {
      this.socks5ProxyPort = socks5ProxyPort;
    }
    if (this.dnsPort == undefined) {
      this.dnsPort = dnsPort;
    }
    if (this.webUiPort == undefined) {
      this.webUiPort = webUiPort;
    }
    if (this.startSocks5 == undefined) {
      this.startSocks5 = startSocks5;
    }
    if (this.startDns == undefined) {
      this.startDns = startDns;
    }

    let appInfoService = ServiceRegistry.getAppInfoService();

    appInfoService.setAppInfo({
      httpProxyPort: this.httpProxyPort,
      socks5ProxyPort: this.socks5ProxyPort,
      dnsPort: this.dnsPort,
      startSocks5: this.startSocks5,
      startDns: this.startDns,
    });
  }

  // 启动代理服务器(http 代理、https代理)
  async _startProxyServer() {
    let appInfoService = ServiceRegistry.getAppInfoService();

    // 获取https代理端口，并记录
    let httpsPort = await getPort(40005);
    appInfoService.setHttpsProxyPort(httpsPort);

    // 启动http转发服务器
    await new HttpServer(this.httpProxyPort, httpsPort).start();

    // 启动https转发服务器
    await new HttpsServer(httpsPort).start();

    // 启动dns服务

    if (this.startDns) {
      await new DnsServer({
        dnsPort: this.dnsPort
      }).start();
    }

    if (this.startSocks5) {
      // 启动socks5代理服务器
      await new Socks5Server({
        socks5Port: this.socks5ProxyPort
      }).start();
    }
  }

  // 启动管理界面服务器
  async _startWebUiServer() {
    let appInfoService = ServiceRegistry.getAppInfoService();
    let webUiPort = await getPort(this.webUiPort);

    // 设置运行时的用户界面端口
    appInfoService.setAppInfo({
      webUiPort: this.webUiPort,
    });

    // 启动web ui
    await new WebUiServer(webUiPort).start();

    appInfoService.printRuntimeInfo();
  }

  // 启动service mock服务器
  async _startServiceMockServer() {

  }
};
