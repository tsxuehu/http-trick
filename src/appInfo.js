
import path from "path";

let _isServer = false;
/**
 * 是否运行在服务器端
 * @returns {boolean}
 */
export function getIsServer() {
    return _isServer;
}

export function setIsServer(isServer) {
    _isServer = isServer;
}

/**
 * 获取配置目录
 */
let userHome = process.env.HOME || process.env.USERPROFILE;
// 配置目录
export let proxyDir = path.join(userHome, ".front-end-proxy");
export let tempDir = path.join(proxyDir, "temp"); // http请求存放目录
export let confDir = path.join(proxyDir, "conf"); // conf请求存放目录
