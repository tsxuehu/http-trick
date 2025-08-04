import IStateBase from "../../../common/IStateBase.ts";

export interface IUserProfile {
  redirectPathVariables: Record<string, string>; // 转发路劲变量
  enableRule: boolean; // 是否启用转发规则
  enableHost: boolean; // 是否启用host解析
  enableFilter: boolean; // 是否启用filter
  goThroughProxyConfig: string; // 需要经过代理的域名
  resolveHost: boolean; // 解析域名
  // 下游代理配置
  externalProxy: boolean; // 是否使用外部http代理
  externalHttpProxy: boolean;
  externalSocks5Proxy: boolean;
  httpProxyIp?: any;
  httpProxyPort: number;
  socks5ProxyIp?: any;
  socks5ProxyPort: number;
}

export default interface IProfileService extends IStateBase<IUserProfile> {
   saveRedirectPathVariables(variables: Record<string, string>): Promise<void>
}
