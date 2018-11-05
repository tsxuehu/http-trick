const ConnectHandle = require("../proxy/http/handle/connectHandle");
const socketIp = require("./socketIp");

module.exports = function (req) {
    if (req.connection.encrypted) { // http代理https协议获取远方ip
        let remotePort = req.connection.remotePort;
        let ip = ConnectHandle.getProxyRequestPortMapedClientIp(remotePort);
        if (ip) return ip;
    }
    let clientIp = socketIp.getRemoteIp(req.socket);
    return clientIp;
}
