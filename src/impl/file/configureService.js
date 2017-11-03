const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');

const defaultConfigure = {
    "gitlabToken": "",
    "proxyPort": 8001,
    "requestTimeoutTime": 10000
};
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ProfileService extends EventEmitter {
    constructor({appInfoService}) {
        super();
        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        this.configureSaveDir = path.join(proxyDataDir, "profile");
    }

    async start() {
        let profileMap = await fileUtil.getJsonFileContentInDir(this.ruleSaveDir);
        _.forEach(profileMap, (content, fileName) => {
            let userId = path.basename(fileName, '.json');
            this.userProfileMap[userId] = content;
        })
    }

    getConfigure() {
        return this.userProfileMap[userId];
    }

    setConfigure(configure) {
        this.userProfileMap[userId] = conf;
        // 发送通知
        this.emit('data-change', userId, conf)
    }

    getProxyPort(clientIp) {
        let userId = this.userService.getClientIpMappedUserId(clientIp);
        return this.getConf(userId).proxyPort;
    }
}