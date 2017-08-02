var cookie = require('cookie');
var _ = require('lodash');
exports.run = function (context) {
    var {req, res, action, actionIndex, toSendResponse, requestHeaders} = context;
    var cookies = cookie.parse(req.headers.cookie);
    var tobeSet = cookie.parse(action.data.cookie);
    toSendResponse.headers[`fe-action-${actionIndex}`] = 'add cookie';
    _.forEach(tobeSet, (value, key) => {
        cookies[key] = value;
    });
    var arr = [];
    _.forEach(cookies, (value, key) => {
        arr.push(`${key}=${value}`)
    });
    requestHeaders.Cookie = arr.join(";");
    return Promise.resolve(false);
};