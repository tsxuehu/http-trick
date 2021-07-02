const crypto = require("crypto");
const net = require('net');
const forge = require('node-forge');
const pki = forge.pki;

const RANDOM_SERIAL = '.' + Date.now() + '.' + Math.floor(Math.random() * 10000);

exports.createRootSecurityContext = function createRootSecurityContext() {
  let keys = pki.rsa.generateKeyPair(2048);
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

  let extensions = [{
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
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions(extensions);

  cert.sign(keys.privateKey, forge.md.sha256.create());

  return {
    key: keys.privateKey,
    cert: cert,
    keyPem: pki.privateKeyToPem(keys.privateKey),
    certPem: pki.certificateToPem(cert)
  };
};

/**
 * 为指定域名创建证书 (使用自定义的根证书)
 * @param hostname
 */
 exports.createHostSecurityContext = function createHostSecurityContext(hostname, rootSecurityContext) {
  let {key: root_key, cert: root_cert} = rootSecurityContext;
  let serialNumber = crypto.createHash('sha1')
    .update(hostname + RANDOM_SERIAL, 'binary').digest('hex');

  let cert = createCert(pki.setRsaPublicKey(root_key.n, root_key.e), serialNumber, true);

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