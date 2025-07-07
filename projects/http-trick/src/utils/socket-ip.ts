import {Socket} from 'net'

// 获取socket连接的客户端ip（server端使用）
/**
 * IPv4 地址格式：如 192.168.1.1
 * IPv6 地址格式：如 ::ffff:192.168.1.1（IPv4 映射的 IPv6 地址，常见于支持 IPv6 的服务器中）
 */
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
