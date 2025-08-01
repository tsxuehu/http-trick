import IConfigureService, { IConfigure } from "../service-api/IConfigureService.ts";
import StateBase from "../../../common/StateBase.ts";

export default class ConfigureService extends StateBase<IConfigure> implements IConfigureService {
  constructor() {
    super({
      professionalVersion: false,
      httpProxyPort: 8001,
      socks5ProxyPort: 8002,
      dnsPort: 53,
      webUiPort: 40010,
      startDns: false,
      startSocks5: true,
      startHttpProxy: true,
      requestTimeoutTime: 30000,
      useCustomRootCA: false,
      remoteDnsServer: '223.5.5.5',
    });
  }
}
