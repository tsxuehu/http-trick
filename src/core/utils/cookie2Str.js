const _ = require("lodash");

module.exports = function (cookies) {
    let arr = [];

    _.forEach(cookies, (value, key) => {
        arr.push(`${key}=${value}`)
    });

    return arr.join(";");
}