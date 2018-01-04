const dns = require("dns");
const log = require("./log");
/**
 * node 调用getAddress会出问题
 * @param host
 * @returns {Promise}
 */
module.exports = function resovleIp(host) {
    // todo https://github.com/avwo/whistle/blob/master/lib/rules/dns.js
    return new Promise((resolve, reject) => {
        var re = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/;
        if (re.test(host)) {
            resolve(host)
        } else {
            dns.lookup(host, (err, ip) => {
                if (err) {
                    log.error("dns解析出错", err);
                    resolve(host);
                } else {
                    resolve(ip);
                }
            });
        }
    });
}