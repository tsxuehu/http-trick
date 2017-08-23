/**
 * Created by tsxuehu on 17/3/29.
 */

// node-forge有毒，不能使用。。。还是open ssl靠谱
var pem = require('pem');
var _ = require('lodash');
var file = require('../utils/file');
var path = require('path');
var fs = require('fs');
var parsedomain = require('parse-domain');
var LRU = require("lru-cache");
var cache = LRU({
    max: 500,
    length: function (n, key) {
        return n.length
    },
    dispose: function (key, n) {
    },
    maxAge: 1000 * 60 * 60
});

var certPath = path.join(file.getUserHomeConfDir(), 'zan_certs/');

/**
 pem.config({
        pathOpenSSL: '/usr/local/bin/openssl'
    })
 */
var dc = require('../datacenter');

module.exports.generateCertForHost = function (host, callback) {

    var domain = host;
    var parsed = parsedomain(host);
    if (parsed && parsed.subdomain) {
        var subdomainList = parsed.subdomain.split('.');
        subdomainList.shift();
        if (subdomainList.length > 0) {
            domain = '*.' + subdomainList.join('.') + '.' +parsed.domain + '.' + parsed.tld;
        }
    }


    // 先查询缓存
    var certKey = domain + '.crt';
    var cert = cache.get(certKey);
    var keykey = domain + '.key';
    var key = cache.get(keykey);
    if (cert && key) {
        callback && callback(cert, key);
    } else {
        Promise.all([new Promise(function (resolve, reject) {
            // 读cert
            fs.readFile(certPath + certKey, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                } else if (!data) {
                    reject(data);
                } else {
                    resolve(data);
                }
            })
        }), new Promise(function (resolve, reject) {
            // 读key
            fs.readFile(certPath + keykey, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                } else if (!data) {
                    reject(data);
                } else {
                    resolve(data);
                }
            })
        })]).then(function (values) {
            callback && callback(values[0], values[1]);
            // 加入缓存
            cache.set(certKey, values[0]);
            cache.set(keykey, values[1]);
        }, function () { // 加载失败, 调用openssl 生成证书
            pem.createCertificate({
                serviceKey: dc.getRootCAKeyPem(),
                serviceCertificate: dc.getRootCACertPem(),
                commonName: domain,
                clientKey: dc.getClientKeyPem(),
                altNames: [domain],
                days: 365 * 10
            }, function (err, result) {
                if (err) throw err;
                callback && callback(result.certificate, result.clientKey);
                // 加入缓存
                cache.set(certKey, result.certificate);
                cache.set(keykey, result.clientKey);
                // 写文件
                fs.writeFile(certPath + certKey, result.certificate, function (err) {
                    if (err) {// 创建目录
                        fs.mkdir(certPath, function () {
                        })
                    }
                });
                fs.writeFile(certPath + keykey, result.clientKey, function (err) {
                });
            })
        });
    }
};