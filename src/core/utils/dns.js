const dns = require("dns");
/**
 * node 调用getAddress会出问题
 * @param host
 * @returns {Promise}
 */
module.exports = function resovleIp(host) {
    return new Promise((resolve, reject) => {
        var re = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/;
        if (re.test(host)) {
            resolve(host)
        } else {
            dns.lookup(host, (err, ip) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(ip);
                }
            });
        }
    });
}