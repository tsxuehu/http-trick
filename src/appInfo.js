export let userConfigDir = "";


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