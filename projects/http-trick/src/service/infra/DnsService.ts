import dns from 'dns'
import {Service} from "@spring4js/container-node";
import {ICacheItem} from "service/infra/dns";
import Future from "../../lib/concurrent/Future";
import log4js from "log4js";

const logger = log4js.getLogger("DnsService");

const TIMEOUT = 5000;
const CACHE_TIME = 30000;
const MAX_CACHE_TIME = Math.max(CACHE_TIME * 3, 600000);
@Service()
export default class DnsService {
    private dnsCache: Record<string, ICacheItem> = {}

    async resolveIp(hostname: string, allowDnsCache: boolean = true) {
        const host = allowDnsCache ? this.dnsCache[hostname] : null;
        let cacheTime = 0;
        if (host) {
            cacheTime = Date.now() - host.time;
        }
        if (host && cacheTime < MAX_CACHE_TIME) {
            if (cacheTime > CACHE_TIME) {
                this.lookupDNSAndCache(host.hostname)
            }
            return host.ip;
        }
        try {
            let result = await this.lookupDNSAndCache(hostname);
            return result.ip;
        } catch (err) {
            logger.error(`resolveIp ${hostname}`, err)
            try {
                let result = await this.lookupDNSAndCache(hostname);
                return result.ip;
            } catch (err2) {
                throw err2;
            }
        }
    }

    async lookupDNSAndCache(hostname: string): Promise<ICacheItem> {
        const future = new Future<ICacheItem>()
        future.setTaskTimeout(TIMEOUT)
        dns.resolve4(hostname, (err, addresses) => {
            if (err) {
                future.reject(err)
            } else {
                future.resolve({
                    ip: addresses[0],
                    hostname,
                    time: Date.now()
                })
            }
        })
        const result = await future.get();
        this.dnsCache[hostname] = result;
        return result;
    }
}
