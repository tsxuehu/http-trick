const ConnectHandle = require("../proxy/http/handle/connectHandle");

module.exports = function (req) {
    if (req.connection.encrypted) { // http代理https协议获取远方ip
        let remotePort = req.connection.remotePort;
        let ip = ConnectHandle.getProxyRequestPortMapedClientIp(remotePort);
        if (ip) return ip;
    }
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
