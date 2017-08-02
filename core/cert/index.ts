/**
 * 证书管理
 */
import LRU from "lru-cache";
import parseDomain from "parse-domain";

export default class CertificationManager {
    static getCertificationManager(certTempDir: string,
                                   root: Certification): CertificationManager {
        // 每一个目录只对应一个manager
        return new CertificationManager(certTempDir, root);
    }

    cache: any;
    // 存放证书的目录
    certTempDir: string;
    // 根证书
    root: Certification;// 根证书
    private constructor(certTempDir: string,
                        root: Certification) {
        this.certTempDir = certTempDir;
        this.root = root;
        this.cache = LRU({
            max: 500,
            length: function (n, key) {
                return n.length
            },
            dispose: function (key, n) {
            },
            maxAge: 1000 * 60 * 60
        });
    }

    /**
     * 为域名获取证书
     * @param host
     * @returns {Promise<Certification>}
     */
    async getCertificationForHost(host: string): Certification {
        let domain = host;
        let parsed = parseDomain(host);
        // 寻找一级域名
        if (parsed && parsed.subdomain) {
            let subdomainList = parsed.subdomain.split('.');
            subdomainList.shift();
            if (subdomainList.length > 0) {
                domain = '*.' + subdomainList.join('.') + '.' + parsed.domain + '.' + parsed.tld;
            }
        }
        return {} as Certification;
    }

    /**
     * 重置根证书
     * @param root
     * @returns {Promise<void>}
     */
    async resetRootCertificate(root: Certification) {
        // 清缓存
    }
}
export type Certification = {
    cert: string,
    key: string
}