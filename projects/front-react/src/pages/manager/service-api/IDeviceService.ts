import IStateBase from "../../../common/IStateBase.ts";

export interface IDeviceInfo {
  id: string
  userId: string
  name: string
  disableMonitor: boolean,
  hostFileName: string,
  externalProxyCanUseUserSetting: boolean,
  externalProxy: boolean,
  externalHttpProxy: boolean,
  externalSocks5Proxy: boolean,
  httpProxyIp: string,
  httpProxyPort: number,
  socks5ProxyIp: string,
  socks5ProxyPort: number
}
export default interface IDeviceService extends IStateBase<IDeviceInfo[]> {
}
