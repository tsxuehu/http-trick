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
        // userId -> profile
        this.userProfileMap = {};
        // clientIp -> userId
        this.clientIpUserMap = {};

        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        this.profileSaveFile = path.join(proxyDataDir, "profile.json");
        this.clientIpUserMapSaveFile = path.join(proxyDataDir, "clientIpUserMap.json");
    }

    async start() {
        let savedUserProfileMap = await fileUtil.readJsonFromFile(this.profileSaveFile);
        this.clientIpUserMap = await fileUtil.readJsonFromFile(this.clientIpUserMapSaveFile);
        // 数据补全
        _.forEach(savedUserProfileMap, (profile, userId) => {
            this.userProfileMap[userId] = _.assign({}, defaultProfile, profile);
        });
    }

    getProfile(userId) {
        return this.userProfileMap[userId];
    }

    async setProfile(userId, conf) {
        this.userProfileMap[userId] = conf;
        // 发送通知
        this.emit('data-change-profile', userId, conf);
        // 将数据写入文件
        await fileUtil.writeJsonToFile(this.profileSaveFile, this.userProfileMap);
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
                let projectPath = this.getProfile(userId).projectPath;
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
    async setEnableRule(userId, enable) {
        let conf = this.userProfileMap[userId];
        conf.enableRule = enable;
        await this.setProfile(userId, this.userProfileMap[userId]);
    }

    /**
     * 获取转发规则启用开关
     * @param clientIp
     */
    enableRule(userId) {
        return this.getProfile(userId).enableRule;
    }

    getProxyPort(clientIp) {
        let userId = this.userService.getClientIpMappedUserId(clientIp);
        return this.getProfile(userId).proxyPort;
    }

    // 获取clientIp对应的user id
    getClientIpMappedUserId(clientIp) {
        return this.clientIpUserMap[clientIp] || 'root';
    }

    // 将ip绑定至用户
    async bindClientIp(userId, clientIp) {
        let originUserId = this.clientIpUserMap[clientIp];
        this.clientIpUserMap[clientIp] = userId;

        await fileUtil.writeJsonToFile(this.clientIpUserMapSaveFile, this.clientIpUserMap);

        let clientIpList = this.getClientIpsMappedToUserId(userId);
        this.emit('data-change-clientIpUserMap', userId, clientIpList);

        if (originUserId) {
            let originClientIpList = this.getClientIpsMappedToUserId(originUserId);
            this.emit('data-change-clientIpUserMap', originUserId, originClientIpList);
        }
    }

    // 获取用户绑定的clientip
    getClientIpsMappedToUserId(userId) {
        let ips = [];
        _.forEach(this.clientIpUserMap, (mapedUserId, ip) => {
            if (mapedUserId == userId) {
                ips.push(ip);
            }
        });
        return ips;
    }
};