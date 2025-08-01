import IAppInfoService, { IAppInfo } from "../service-api/IAppInfoService.ts";
import StateBase from "../../../common/StateBase.ts";

export default class AppInfoService extends StateBase<IAppInfo> implements IAppInfoService {
  constructor() {
    super({
      appName: 'Http-Trick',
      single: true,
      httpProxyPort: 0,
      httpsProxyPort: 0,
      socks5ProxyPort: 0,
      dnsPort: 0,
      webUiPort: 0,
      startHttpProxy: false,
      startSocks5: false,
      startDns: false,
      pcIp: "",
    });
  }
}
