"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lruCache = require("lru-cache");

var _lruCache2 = _interopRequireDefault(_lruCache);

var _parseDomain = require("parse-domain");

var _parseDomain2 = _interopRequireDefault(_parseDomain);

var _file = require("../utils/file");

var fileUtils = _interopRequireWildcard(_file);

var _pem = require("pem");

var _pem2 = _interopRequireDefault(_pem);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let manager;
/**
 * 证书管理
 */
class CertificationManager {
    /**
     *
     * @returns {*}
     */
    static getCertificationManager() {
        if (!manager) {
            // 获取临时目录 和 根证书

            manager = new CertificationManager(certTempDir, root);
        }
        return manager;
    }

    /**
     * 为指定域名创建证书 (使用自定义的根证书)
     * @param host
     * @returns {Promise<Certification>}
     */
    static createCertificate(host, root) {
        return new Promise((resolve, reject) => {
            _pem2.default.createCertificate({
                serviceKey: root.key,
                serviceCertificate: root.cert,
                commonName: host,
                clientKey: clientKey,
                altNames: [host],
                days: 365 * 10
            }, function (err, result) {
                if (err) reject(err);
                resolve({ key: result.clientKey, cert: result.certificate });
            });
        });
    }

    /**
     *
     * @param certTempDir 存放证书的目录
     * @param root 根证书的key 和 cert
     */
    constructor(certTempDir, root) {
        // 存放证书的目录
        this.certTempDir = certTempDir;
        // 根证书
        this.root = root;
        this.cache = (0, _lruCache2.default)({
            max: 500,
            length: function (n, key) {
                return n.length;
            },
            dispose: function (key, n) {},
            maxAge: 1000 * 60 * 60
        });
        //todo 证书存储目录校验，如果缓存目录下的rootca和root不样，则抛异常。 若没有则写入rootca
    }

    /**
     * 为域名获取证书
     * @param host
     * @returns {Promise<Certification>}
     */
    getCertificationForHost(host) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let domain = host;
            let parsed = (0, _parseDomain2.default)(host);
            // 寻找一级域名
            if (parsed && parsed.subdomain) {
                let subdomainList = parsed.subdomain.split('.');
                subdomainList.shift();
                if (subdomainList.length > 0) {
                    domain = '*.' + subdomainList.join('.') + '.' + parsed.domain + '.' + parsed.tld;
                }
            }

            let certKey = domain + '.crt';
            let keykey = domain + '.key';
            let cacheHit = true; // 是否命中缓存标识

            // 从缓存里取数据
            let cert = _this.cache.get(certKey);
            let key = _this.cache.get(keykey);

            // 从存放证书的临时文件夹里取数据
            if (!cert || !key) {
                cert = yield fileUtils.readFile(certKey);
                key = yield fileUtils.readFile(keykey);
                cacheHit = false;
            }

            // 调用openssl生成证书，并保存到临时文件夹里
            if (!cert || !key) {
                ({ key, cert } = yield CertificationManager.createCertificate(domain, _this.root));
                // 保存到文件
                yield fileUtils.writeFile(keykey, key);
                yield fileUtils.writeFile(certKey, cert);
                cacheHit = false;
            }
            if (!cacheHit) {
                // 放到缓存
                _this.cache.set(certKey, cert);
                _this.cache.set(keykey, key);
            }
            return {
                cert,
                key
            };
        })();
    }

    /**
     * todo 重置根证书
     * @param root
     * @returns {Promise<void>}
     */
    resetRootCertificate(root) {
        // 清证书缓存

        // 设置值

        return _asyncToGenerator(function* () {})();
    }
}

exports.default = CertificationManager;
const clientKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAqWrHtSoXJVlZVaWXKJVhcFYtzWktc5T3Y451FizP/NaUSKSy
kFF733xtwuihhFg5sM1W7S4Twgy3qh46NyWLssV3kkdtFkp1e0w65qLJ2UFmnjZB
RCPvJ/ueCYCu+2fLT1z0K4xN3a8BUsH6GWq/YPfIKNi0MmjSJOuEq7QXu6JM1X8E
Esc2yA2WJw1ILjdw2aBV+3/mnn+YV061MyRfgPFtIOdjqmGokphttbT+32+rIyGh
oFL6/GwLuc3BQgz+sJpWWvyiQugZ5KgoYmn0CU3i4U7G1aSyFztcXya+m7Zn5Me6
vLVXE7QuXeBixucC3Oivq2qZyzjm78FLH7Ge4wIDAQABAoIBACWHqBHz7wixEF8u
vZuZ6+nszVyxrgXqvBrr1fhBmRmTl2m4Qm5B/sT1VYNV8WHWAYGvG1CTYoEcPBuN
cqwAvz+tCt32wK2tdPUJYArziO9903O85RxpMXOUA+BrB1heF+XO27BB9oXjXNGu
cu7qfNbITSjvSIvaOKNBITTAQnmoEAIKK74u8vpXuBvEzW4KN67P6dfAnOTvYpQ6
BWIuoq7RgGUKbp1morL2OTrdCXztMXKQcRZ+5NUr5l7kZZpGTiBQlF+Y89lEMLqn
oyp4jrjMGNXVDfNoZMC9EmUg2iInz669UAqacho/SqxDuqNEi0v8XmHB56WebKIF
+oJNRVECgYEA4HcrH7oYlUirBSZNsRnGhWMim6lLm24h482klEwgwq44etm9RK5C
gfY8IFPm5DenyKASu6DqtCkmJzjv+dPvVJn0r8WeNFs9ib3+7nnKTAXNstirKriN
Pcc4/QLy2s3CC0vPaqc8fuDqVrLA8UWeU0fMT0TTMHjwH5figBfRy3cCgYEAwTfQ
Puea94Z2GJylVKh2Cc8ojCm+2DpXb7RKkCErGIxBsFHoAJaILEKyWWyOgyafZGcq
D1BGHX3hNvFRX8UVuOy86h2mmC+J8QxzlsN+KtQol4rYX1dYjbhCpLnZRI7mHetM
wzIHhUZEKntvcoKabH8BLfejRX+92/dexB0SyvUCgYEA0XCf/kSH95MMcAujZmIk
iAVOH2xBrc9/M62HqQ+3aa9h588O+OyYBeeZhpiC0eLUXTBvCj9Ff8D9Zo+L6tHD
eG8GjpOX4EZaDxIGssFU7sZjfkMIwx3cPA6NsBZ2P47JRf0AlgVhPwnh3e+AdB9/
cTmG+1e+rnXJp9DyeI7BJFUCgYEAuYUrsJqVEwHKNsuBe43c+IIt/pa+pcMu3RSR
W15dkM5q7C9YwefHjCfmMzKmi4r0FGVx3w5GpF6Pdj+y0G/d8ZdttKUPpqROoGJC
QgonBFx9NTSdmL23SywW4S+JS+ihTyz0oZ9R1Ueof9nRInQAbhhsO4TBAiQrWh9k
oI0B1FkCgYEAj56WECOoRCSveCoLo81wsIIsNQhywjo/QcNcFDJxgXPdBM8bZQ3l
JWbgcdUCeym1hvWnqufWtW6SRzAn+K5cKEc8meyYPI0od7I2nAOpFEtGIp2L/t9W
LmXYTMc3eKo407saTuv59S5qLto2bG+z+ClOrkNxX7KTy8Am0iBGqa0=
-----END RSA PRIVATE KEY-----`;