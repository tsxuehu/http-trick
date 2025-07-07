import {Resource, Service} from "di/annotation";
import ProfileService from "service/manage/ProfileService";
import HostDataService from "service/manage/HostDataService";
import find from "lodash/find";
import net from "net";
import DnsService from "service/infra/DnsService";
import {IConnectInfo} from "service/intercept/host-resolve";
import {IProcessContext} from "service/intercept/http";

@Service()
export default class HostResolveService {
    @Resource() private profileService: ProfileService
    @Resource() private hostDataService: HostDataService
    @Resource() private dnsService: DnsService

    // 记录proxy 请求内部https server链接 和 client的ip 之间的映射关系
    // 方便 https server 处理请求时，能够找出对应的client ip
    private httpProxyConnectInfoMap: Record<number, IConnectInfo> = {};
    private socks5ProxyConnectInfoMap: Record<number, IConnectInfo> = {};


    getHttpProxyConnectInfo(port: number): IConnectInfo {
        return this.httpProxyConnectInfoMap[port];
    }

    setHttpProxyConnectInfo(port: number, info: IConnectInfo): void {
        this.httpProxyConnectInfoMap[port] = info;
    }

    removeHttpProxyConnectInfo(port: number): void {
        delete this.httpProxyConnectInfoMap[port];
    }

    getSocks5ProxyConnectInfo(id: number): IConnectInfo {
        return this.socks5ProxyConnectInfoMap[id];
    }

    setSocks5ProxyConnectInfo(id: number, info: IConnectInfo): void {
        this.socks5ProxyConnectInfoMap[id] = info;
    }

    removeSocks5ProxyConnectInfo(id: number): void {
        delete this.socks5ProxyConnectInfoMap[id];
    }

    // ======================================================================

    async resolveHostDirect(userId: string, hostname: string, deviceId: string) {
        let result = await this.resolveHostWithWay(userId, deviceId, hostname);
        return result.ip;
    }

    async resolveHostWithoutProfile(hostname: string): Promise<string> {
        const ip = await this.dnsService.resolveIp(hostname);
        return ip;
    }

    async resolveHostAndSetInfoToContext(hostname: string, context: IProcessContext) {
        const {userId, deviceId, actualRequestData, toClientResponse} = context;
        toClientResponse.dnsResolveBeginTime = Date.now();
        const resolved = await this.resolveHostWithWay(userId, deviceId, hostname);
        actualRequestData.originHostname = hostname
        actualRequestData.hostname = resolved.ip
        toClientResponse.headers['proxy-remote-ip'] = resolved.ip;
        toClientResponse.headers['proxy-resolve-way'] = resolved.way;
        toClientResponse.remoteIp = resolved.ip;
    }

    async resolveHostWithWay(userId: string, deviceId: string, hostname: string) {
        let ip = '';
        let way = '';
        if (!hostname) return undefined;

        if (this.isIp(hostname)) {
            way = 'hostname is ip';
            ip = hostname;
        } else if (this.profileService.enableHost(userId)) {
            // 解析host
            let inUsingHosts;
            inUsingHosts = this.hostDataService.getCurrentUsingHosts(userId);
            way = 'user-' + encodeURIComponent(inUsingHosts.name) + ' ';

            ip = inUsingHosts.hostMap[hostname];
            if (!ip) {
                // 配置 *开头的host  计算属性globHostMap已经将*去除
                ip = find(inUsingHosts.globHostMap, (value, host) => {
                    return hostname.endsWith(host);
                });
            }
        }

        if (!ip) {
            way += 'dns';
            // 调用dns解析
            ip = await this.dnsService.resolveIp(hostname);
        }

        return {
            way, ip
        };
    }

    isIp(str: string) {
        return !!net.isIP(str);

    }
}
