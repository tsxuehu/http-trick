import IConfigureService, { IConfigure } from '../service-api/IConfigureService.ts'
import StateBase from '../../../common/StateBase.ts'
import * as configApi from '../../../api/conf.ts'
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
    })
  }

  async save(part: Partial<IConfigure>): Promise<void> {
    const oldConfig = this.getState()
    await configApi.saveFile(Object.assign({}, oldConfig, part))
  }
  setConfig(config: IConfigure): void {
    this.setState(config)
  }
  getConfig(): IConfigure {
    return this.getState()
  }
}
