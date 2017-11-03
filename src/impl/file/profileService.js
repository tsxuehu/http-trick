const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');

const defaultProfile = {
    "projectPath": {},
    "enableRule": true
};
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ProfileService extends EventEmitter {
    constructor({userService, appInfoService}) {
        super();
        this.userService = userService;

        this.userProfileMap = {};
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

    getConf(userId) {
        return this.userProfileMap[userId];
    }

    setConf(userId, conf) {
        this.userProfileMap[userId] = conf;
        // 发送通知
        this.emit('data-change', userId, conf)
    }

    /**
     * 替换redirect中的变量引用,
     * 如果引用的变量不存在，则不做替换
     * @param clientIp
     * @param href
     * @param match
     * @param target
     */
    calcPath(userId, href, match, target) {
        if (match) {
            try {
                let matchList = href.match(new RegExp(match));
                _.forEach(matchList, function (value, index) {
                    if (index == 0) return;
                    var reg = new RegExp('\\$' + index, 'g');
                    if (value === undefined) value = '';
                    target = target.replace(reg, value);
                });
                let compiled = _.template(target);
                let projectPath = this.getConf(userId).projectPath;
                // 解析应用的变量
                return compiled(projectPath);
            } catch (e) {
            }
        }
    }

    /**
     *
     * @param userId
     * @param enable
     */
    setEnableRule(userId, enable) {
        let conf = this.userProfileMap[userId];
        conf.enableRule = enable;
        this.setConf(userId, this.userProfileMap[userId]);
    }

    /**
     * 获取转发规则启用开关
     * @param clientIp
     */
    enableRule(userId) {
        return this.getConf(userId).enableRule;
    }

    getProxyPort(clientIp) {
        let userId = this.userService.getClientIpMappedUserId(clientIp);
        return this.getConf(userId).proxyPort;
    }
}