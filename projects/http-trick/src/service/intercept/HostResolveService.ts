import {Resource, Service} from "di/annotation";
import ProfileService from "service/manage/ProfileService";
import HostDataService from "service/manage/HostDataService";
import {IHostFileCacheItem} from "service/manage/host";
import find from "lodash/find";
import net from "net";
import DnsService from "service/infra/DnsService";

@Service()
export default class HostResolveService {
    @Resource() private profileService: ProfileService
    @Resource() private hostDataService: HostDataService
    @Resource() private dnsService: DnsService


    async resolveHostDirect(userId: string, hostname: string, deviceId: string) {
        let result = await this.resolveHostWithWay(userId, deviceId, hostname);
        return result.ip;
    }

    async resolveHostWithoutProfile(hostname: string): Promise<string> {
        const ip = await this.dnsService.resolveIp(hostname);
        return ip;
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
