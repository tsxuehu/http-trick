const ConnectHandle = require("../server/http/handle/connectHandle");
const socketIp = require("./socketIp");
/**
 * 获取https 代理的 远程客户端的ip
 * @param req
 * @returns {*}
 */
module.exports = function (req) {
  if (req.connection.encrypted) { // http代理https协议获取远方ip
    let remotePort = req.connection.remotePort;
    let ip = ConnectHandle.getProxyRequestPortMapedClientIp(remotePort);
    if (ip) return ip;
  }
  let clientIp = socketIp.getRemoteIp(req.socket);
  return clientIp;
}
