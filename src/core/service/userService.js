module.exports = class UserRepository {

    constructor() {

    }

    // 获取clientIp对应的user id
    getClientIpMappedUserId(clientIp) {
        return 'root';
    }
}