"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 证书管理
 */
const lru_cache_1 = require("lru-cache");
const parse_domain_1 = require("parse-domain");
class CertificationManager {
    static getCertificationManager(certTempDir, root) {
        return new CertificationManager(certTempDir, root);
    }
    constructor(certTempDir, root) {
        this.certTempDir = certTempDir;
        this.root = root;
        this.cache = lru_cache_1.default({
            max: 500,
            length: function (n, key) {
                return n.length;
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
    getCertificationForHost(host) {
        return __awaiter(this, void 0, void 0, function* () {
            let domain = host;
            let parsed = parse_domain_1.default(host);
            // 寻找一级域名
            if (parsed && parsed.subdomain) {
                let subdomainList = parsed.subdomain.split('.');
                subdomainList.shift();
                if (subdomainList.length > 0) {
                    domain = '*.' + subdomainList.join('.') + '.' + parsed.domain + '.' + parsed.tld;
                }
            }
            return {};
        });
    }
    /**
     * 重置根证书
     * @param root
     * @returns {Promise<void>}
     */
    resetRootCertificate(root) {
        return __awaiter(this, void 0, void 0, function* () {
            // 清缓存
        });
    }
}
exports.default = CertificationManager;
