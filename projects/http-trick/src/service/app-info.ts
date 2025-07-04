export interface IAppInfo {
    appName: string
    single: boolean // 是否是单用户模式
    httpProxyPort: number // 真实的代理端口
    httpsProxyPort: number
    socks5ProxyPort: number
    dnsPort: number
    webUiPort: number
    startHttpProxy: boolean
    startSocks5: boolean
    startDns: boolean
    pcIp: string
}
