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
export interface IProxyConfig {
    hasExternalProxy: boolean,
    proxyType?: 'socks5' | 'http',
    proxyIp?: string,
    proxyPort?: number
}

export const defaultProfile: IUserProfile = {
    redirectPathVariables: {},
    enableRule: true,
    enableHost: true,
    enableFilter: true,
    goThroughProxyConfig: '',
    resolveHost: false,
    externalProxy: false,
    externalHttpProxy: false,
    externalSocks5Proxy: true,
    httpProxyIp: '',
    httpProxyPort: 8888,
    socks5ProxyIp: '',
    socks5ProxyPort: 8889
};
