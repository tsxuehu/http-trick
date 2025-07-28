import {Resource, Service} from "@spring4js/container-node";
import AppInfoService from "service/AppInfoService";
import FileService from "service/infra/FileService";
import ConfigureService from "service/manage/ConfigureService";
import path from "path";
import {LRUCache} from 'lru-cache'
import {IRootSecurityContext} from "service/manage/certification";
import {parseDomain, ParseResultType} from 'parse-domain'
import forge from 'node-forge'
import {createHostSecurityContext} from "../../utils/cert";

const pki = forge.pki;

@Service()
export default class CertificationService {
    @Resource() private appInfoService: AppInfoService
    @Resource() private fileService: FileService
    @Resource() private configureService: ConfigureService

    private certTempDir: string
    private rootSecurityContext: IRootSecurityContext
    private cache: LRUCache<string, string>

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.certTempDir = path.resolve(dataDir, "certificate");
        this.cache = new LRUCache<string, string>({
            max: 500,
            maxSize: 5 * 1024 * 1024,
            sizeCalculation: (v: string, key: string) => {
                return v.length
            },
            ttl: 1000 * 60 * 60
        });

        // 读取根证书, 如果使用自定义证书，则从 dataDir/rootca目录加载
        let keyFilePath;
        let certFilePath;
        if (!this.configureService.useCustomRootCA()) {
            let appDir = this.appInfoService.getAppDir();
            keyFilePath = path.join(appDir, 'certificate/root.key.pem');
            certFilePath = path.join(appDir, 'certificate/root.crt.pem');
        } else {
            let dataDir = this.appInfoService.getProxyDataDir();
            keyFilePath = path.join(dataDir, 'rootCA/custom.key.pem');
            certFilePath = path.join(dataDir, 'rootCA/custom.crt.pem');
        }

        let keyPem = await this.fileService.readFile(keyFilePath);
        let certPem = await this.fileService.readFile(certFilePath);
        let key = pki.privateKeyFromPem(keyPem);
        let cert = pki.certificateFromPem(certPem);
        this.rootSecurityContext = {
            certPem,
            keyPem,
            key,
            cert
        };
    }

    /**
     * 为域名获取证书
     */
    async getHostSecurityContext(host: string) {
        let lastDomain = host;
        /**
         * 解析后 www.baidu.com
         * {
         *   domain: "baidu"
         *   subdomain: "www"
         *   tld: "com"
         *  }
         * @type {*}
         */

        const parseResult = parseDomain(host);
        if (parseResult.type === ParseResultType.Listed) {
            const {subDomains, domain, topLevelDomains} = parseResult;
            if (subDomains.length > 0) {
                lastDomain = '*.' + domain + '.' + topLevelDomains.join('.');
            }
        }

        const nomalizedDomain = lastDomain.replace('*', '+');
        const certKey = nomalizedDomain + '.crt';
        const keykey = nomalizedDomain + '.key';

        let cacheHit = true; // 是否命中缓存标识

        // 从缓存里取数据
        let certPem = this.cache.get(certKey);
        let keyPem = this.cache.get(keykey);
        try {
            // 从存放证书的临时文件夹里取数据
            if (!certPem || !keyPem) {
                certPem = await this.fileService.readFile(path.join(this.certTempDir, certKey));
                keyPem = await this.fileService.readFile(path.join(this.certTempDir, keykey));
                cacheHit = false;
            }
        } catch (e) {
            // 调用openssl生成证书，并保存到临时文件夹里
            if (!certPem || !keyPem) {
                ({keyPem, certPem} = createHostSecurityContext(lastDomain, this.rootSecurityContext));
                // 保存到文件
                await this.fileService.writeFile(path.join(this.certTempDir, keykey), keyPem);
                await this.fileService.writeFile(path.join(this.certTempDir, certKey), certPem);
                cacheHit = false;
            }
        }
        if (!cacheHit) {
            // 放到缓存
            this.cache.set(certKey, certPem);
            this.cache.set(keykey, keyPem);
        }
        return {
            certPem,
            keyPem
        };
    }

    getRootCACertPem() {
        return this.rootSecurityContext.certPem;
    }
}
