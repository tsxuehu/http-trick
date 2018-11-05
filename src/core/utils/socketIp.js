// 获取socket连接的客户端ip（server端使用）
module.exports.getRemoteIp = function (socket) {
    let remoteIp = socket.remoteAddress;
    if (remoteIp.indexOf('::') !== -1) {
        remoteIp = remoteIp.split(':')[3];
    }
    return remoteIp;
}

// 获取socket请求的发送端口(client使用)
module.exports.getRequestPort = function (socket) {

}
