const crypto = require("crypto");
const net = require('net');
const LRU = require("lru-cache");
const forge = require('node-forge');
const parseDomain = require("parse-domain");
const fileUtils = require("../utils/file");
const path = require("path");

const RANDOM_SERIAL = '.' + Date.now() + '.' + Math.floor(Math.random() * 10000);
const pki = forge.pki;
const CUR_VERSION = process.version;
const requiredVersion = parseInt(CUR_VERSION.slice(1), 10) >= 6;
/**
 * 证书管理
 */
module.exports = class CertificationService {
  /**
   *
   * @param certTempDir 存放证书的目录
   * @param root 根证书的key 和 cert
   */
  constructor({appInfoService}) {
    // 存放证书的目录
    this.appInfoService = appInfoService;
    let proxyDataDir = this.appInfoService.getProxyDataDir();
    // 监控数据缓存目录
    this.certTempDir = path.join(proxyDataDir, "certificate");
    // 根证书

    // 缓存
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

  async start() {
    // 读取根证书
    let appDir = this.appInfoService.getAppDir();

    let keyPem = await fileUtils.readFile(path.join(appDir, 'certificate/zproxy.key.pem'));
    let certPem = await fileUtils.readFile(path.join(appDir, 'certificate/zproxy.crt.pem'));
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
   * @param host
   * @returns {Promise<Certification>}
   */
  async getCertificationForHost(host) {
    let domain = host;
    /**
     * 解析后 www.baidu.com
     * {
         *   domain: "baidu"
         *   subdomain: "www"
         *   tld: "com"
         *  }
     * @type {*}
     */
    let parsed = parseDomain(host);
    // 寻找一级域名
    if (parsed && parsed.subdomain) {
      let subdomainList = parsed.subdomain.split('.');
      if (subdomainList.length > 1) {
        subdomainList.shift();
        domain = '*.' + subdomainList.join('.') + '.' + parsed.domain + '.' + parsed.tld;
      } else if (subdomainList.length == 1){
        domain = '*.' + parsed.domain + '.' + parsed.tld;
      }
    }

    let certKey = domain + '.crt';
    let keykey = domain + '.key';

    let cacheHit = true; // 是否命中缓存标识

    // 从缓存里取数据
    let certPem = this.cache.get(certKey);
    let keyPem = this.cache.get(keykey);
    try {
      // 从存放证书的临时文件夹里取数据
      if (!certPem || !keyPem) {
        certPem = await fileUtils.readFile(path.join(this.certTempDir, certKey));
        keyPem = await fileUtils.readFile(path.join(this.certTempDir, keykey));
        cacheHit = false;
      }
    } catch (e) {
      // 调用openssl生成证书，并保存到临时文件夹里
      if (!certPem || !keyPem) {
        ({keyPem, certPem} = await createHostSecurityContext(domain, this.rootSecurityContext));
        // 保存到文件
        await fileUtils.writeFile(path.join(this.certTempDir, keykey), keyPem);
        await fileUtils.writeFile(path.join(this.certTempDir, certKey), certPem);
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
};


/**
 * 为指定域名创建证书 (使用自定义的根证书)
 * @param hostname
 */
function createHostSecurityContext(hostname, rootSecurityContext) {
  let {key: root_key, cert: root_cert} = rootSecurityContext;
  let serialNumber = crypto.createHash('sha1')
    .update(hostname + RANDOM_SERIAL, 'binary').digest('hex');

  let cert = createCert(pki.setRsaPublicKey(root_key.n, root_key.e), serialNumber, false);

  cert.setSubject([{
    name: 'commonName',
    value: hostname
  }]);

  cert.setIssuer(root_cert.subject.attributes);
  cert.setExtensions([{
    name: 'subjectAltName',
    altNames: [net.isIP(hostname) ?
      {
        type: 7,
        ip: hostname
      } : {
        type: 2,
        value: hostname
      }]
  }]);
  cert.sign(root_key, forge.md.sha256.create());
  let hostSecurityContext = {
    keyPem: pki.privateKeyToPem(root_key),
    certPem: pki.certificateToPem(cert)
  };
  return hostSecurityContext;
}

function createRootSecurityContext() {
  let keys = pki.rsa.generateKeyPair(requiredVersion ? 2048 : 1024);
  let cert = createCert(keys.publicKey);
  let now = Date.now() + getRandom();
  let attrs = [{
    name: 'commonName',
    value: 'http-trick.' + now
  }, {
    name: 'countryName',
    value: 'CN'
  }, {
    shortName: 'ST',
    value: 'ZJ'
  }, {
    name: 'localityName',
    value: 'HZ'
  }, {
    name: 'organizationName',
    value: now + '.http-trick.org'
  }, {
    shortName: 'OU',
    value: 'http-trick.org'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }]);

  cert.sign(keys.privateKey, forge.md.sha256.create());

  return {
    key: keys.privateKey,
    cert: cert,
    keyPem: pki.privateKeyToPem(keys.privateKey),
    certPem: pki.certificateToPem(cert)
  };
}

function createCert(publicKey, serialNumber, isShortPeriod) {
  let cert = pki.createCertificate();
  cert.publicKey = publicKey;
  cert.serialNumber = serialNumber || '01';
  let curYear = new Date().getFullYear();
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notBefore.setFullYear(curYear - 1);
  // https://chromium.googlesource.com/chromium/src/+/refs/heads/master/net/cert/cert_verify_proc.cc#900
  cert.validity.notAfter.setFullYear(curYear + (isShortPeriod ? 1 : 10));
  return cert;
}

function getRandom() {
  let random = Math.floor(Math.random() * 1000);
  if (random < 10) {
    return '00' + random;
  }
  if (random < 100) {
    return '0' + random;
  }
  return '' + random;
}
