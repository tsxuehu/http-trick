const _ = require("lodash");

module.exports = function (cookies) {
    let arr = [];
    _.forEach(cookies, (value, key) => {
        arr.push(`${key}=${encodeURIComponent(value)}`)
    });

    return arr.join(";");
}