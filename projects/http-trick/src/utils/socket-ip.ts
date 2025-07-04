import {Socket} from 'net'

// 获取socket连接的客户端ip（server端使用）
export function getRemoteIp(socket: Socket) {
    let remoteIp = socket.remoteAddress!;
    if (remoteIp.indexOf('::') !== -1) {
        remoteIp = remoteIp.split(':')[3];
    }
    return remoteIp;
}

// 获取socket请求的发送端口(client使用)
export function getRequestPort(socket: Socket) {

}
