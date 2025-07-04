"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoteIp = getRemoteIp;
exports.getRequestPort = getRequestPort;
function getRemoteIp(socket) {
    let remoteIp = socket.remoteAddress;
    if (remoteIp.indexOf('::') !== -1) {
        remoteIp = remoteIp.split(':')[3];
    }
    return remoteIp;
}
function getRequestPort(socket) {
}
//# sourceMappingURL=socket-ip.js.map