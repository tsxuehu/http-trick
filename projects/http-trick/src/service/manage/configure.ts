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


export const DefaultConfigure: IConfigure = {
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
};