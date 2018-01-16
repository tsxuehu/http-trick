const _ = require("lodash");

module.exports = function (cookies) {
    let arr = [];
    _.forEach(cookies, (value, key) => {
        arr.push(`${key}=${encodeURI(value)}`)
    });

    return arr.join("; ");
}