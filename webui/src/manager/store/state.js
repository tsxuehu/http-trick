// 数据中心

export default {
  // 运行用户
  userId: 'guest',
  // 运行时信息
  appInfo: {
    appName: '',
    single: true,
    httpProxyPort: "",
    httpsProxyPort: "",
    socks5ProxyPort: "",
    dnsPort: "",
    webUiPort: "",
    startHttpProxy: true,
    startSocks5: true,
    startDns: false,
    pcIp: "",
  },
  // 基本配置信息
  configure: {
    professionalVersion: false,
    httpProxyPort: 8001,
    socks5ProxyPort: 8002,
    dnsPort: 53,
    webUiPort: 40001,
    startDns: false,
    startSocks5: true,
    startHttpProxy: true,
    requestTimeoutTime: 30000,
    useCustomRootCA: false,
    remoteDnsServer: '',
  },
  // 个人配置
  profile: {
    redirectPathVariables: {},// 转发路劲变量
    enableRule: true,// 是否启用转发规则
    enableHost: true,// 是否启用host解析
    enableFilter: true,// 是否启用filter
    goThroughProxyConfig: '',// 需要经过代理的域名
    externalProxy: false,// 是否使用外部http代理
    externalHttpProxy: false,
    externalSocks5Proxy: true,
    httpProxyIp: '',
    httpProxyPort: 8888,
    socks5ProxyIp: '',
    socks5ProxyPort: 8889
  },


  // 绑定的设备
  /**
   * {
        id: deviceId,
        userId: '',
        name: deviceId,
        disableMonitor: false,
        hostFileName: '',
        externalProxyCanUseUserSetting: true,
        externalProxy: false,
        externalHttpProxy: false,
        externalSocks5Proxy: false,
        httpProxyIp: '',
        httpProxyPort: 8888,
        socks5ProxyIp: '',
        socks5ProxyPort: 8889
      }
   */
  bindedDeviceList: [],
  // 生效的规则
  rule: [],
  // host文件列表
  hostFileList: [],
  // rule文件列表
  ruleFileList: [],
  filters: [],
  dataList: [],
}
