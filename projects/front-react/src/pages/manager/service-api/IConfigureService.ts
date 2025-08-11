import IStateBase from '../../../common/IStateBase.ts'

export interface IConfigure {
  professionalVersion: boolean // 是否开启专业版
  httpProxyPort: number
  socks5ProxyPort: number
  dnsPort: number
  webUiPort: number
  startDns: boolean
  startSocks5: boolean
  startHttpProxy: boolean
  requestTimeoutTime: number
  useCustomRootCA: boolean
  remoteDnsServer: string // 远程dns解析服务器
}

export default interface IConfigureService extends IStateBase<IConfigure> {
  save(newConfig: Partial<IConfigure>): Promise<void>
  setConfig(config: IConfigure): void
  getConfig(): IConfigure
}
