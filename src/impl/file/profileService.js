const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');

const defaultProfile = {
    // 工程路径配置
    "projectPath": {},
    // 是否启用转发规则
    "enableRule": true,
    // 是否启用host解析
    "enableHost": true,
    // 是否启用filter
    "enableFilter": true,
    // socks代理解析的ip
    "socksProxyNeedParseIp": '0.0.0.0',
};
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ProfileService extends EventEmitter {
    constructor({appInfoService}) {
        super();
        // userId -> profile
        this.userProfileMap = {};
        // deviceId -> info { userId: , name: '', id: ''}
        this.deviceInfo = {};
        // 用户socks配置缓存
        this._socksProxyCahce = {};
        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        this.profileSaveDir = path.join(proxyDataDir, "profile");
        this.deviceInfoSaveFile = path.join(proxyDataDir, "deviceInfo.json");
    }

    async start() {
        let profileMap = await fileUtil.getJsonFileContentInDir(this.profileSaveDir);
        _.forEach(profileMap, (profile, fileName) => {
            let userId = fileName.slice(0, -5);
            // 补全profile数据
            // this.userProfileMap[userId] = _.assign({}, defaultProfile, profile);;
            this.userProfileMap[userId] = profile;

        });
        // 加载deviceId-> userID映射
        this.deviceInfo = await fileUtil.readJsonFromFile(this.deviceInfoSaveFile);
    }

    getProfile(userId) {
        return this.userProfileMap[userId] || defaultProfile;
    }

    async setProfile(userId, profile) {
        this.userProfileMap[userId] = profile;
        delete  this._socksProxyCahce[userId];

        let filePath = path.join(this.profileSaveDir, `${userId}.json`);
        // 将数据写入文件
        await fileUtil.writeJsonToFile(filePath, profile);
        // 发送通知
        this.emit('data-change-profile', userId, profile);
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
        }
    }

    /**
     *
     * @param userId
     * @param enable
     */
    async setEnableRule(userId, enable) {
        let conf = this.getProfile(userId);
        conf.enableRule = enable;
        await this.setProfile(userId, conf);
    }

    async setEnableHost(userId, enable) {
        let conf = this.getProfile(userId);
        conf.enableHost = enable;
        await this.setProfile(userId, conf);
    }

    async setEnableFilter(userId, enable) {
        let conf = this.getProfile(userId);
        conf.enableFilter = enable;
        await this.setProfile(userId, conf);
    }


    /**
     * 获取转发规则启用开关
     * @param clientIp
     */
    enableRule(userId) {
        return this.getProfile(userId).enableRule;
    }

    enableHost(userId) {
        return this.getProfile(userId).enableHost;
    }

    enableFilter(userId) {
        return this.getProfile(userId).enableFilter;
    }

    // 获取clientIp对应的user id
    getUserIdBindDevice(deviceId) {
        let info = this.deviceInfo[deviceId];
        if (!info || info.userId) {
            return 'root'
        }
        return info.userId;
    }

    isDeviceEnableMonitor(deviceId) {
        let info = this.deviceInfo[deviceId];
        if (!info) return true;
        return !info.disableMonitor;
    }

    getDevice(deviceId) {
        return this.deviceInfo[deviceId];
    }

    getDeviceInfoSetDefaultIfPossible(deviceId) {
        let info = this.deviceInfo[deviceId];
        if (!info) {
            info = this.deviceInfo[deviceId] = {
                id: deviceId,
                userId: '',
                name: deviceId,
                disableMonitor: false,
                hostFileName: ''
            };
        }
        return info;
    }

    // 将ip绑定至用户
    async bindDevice(userId, deviceId) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);
        let originUserId = info.userId;
        if (userId == originUserId) {
            return
        }
        info.userId = userId;
        this.deviceInfo[deviceId] = info;

        await fileUtil.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(userId);
        this.emit('data-change-deviceList', userId, deviceList);

        if (originUserId) {
            let originClientIpList = this.getDeviceListBindedToUserId(originUserId);
            this.emit('data-change-deviceList', originUserId, originClientIpList);
        }
    }

    // 解除绑定至用户
    async unbindDevice(deviceId) {
        let info = this.deviceInfo[deviceId];
        delete this.deviceInfo[deviceId];

        await fileUtil.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        if (info) {
            let originDeviceList = this.getDeviceListBindedToUserId(info.userId);
            this.emit('data-change-deviceList', info.userId, originDeviceList);
        }
    }

    async setDeviceName(deviceId, name) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.name = name;

        this.deviceInfo[deviceId] = info;

        await fileUtil.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    async setDisableMonitor(deviceId, disableMonitor) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.disableMonitor = disableMonitor;

        this.deviceInfo[deviceId] = info;

        await fileUtil.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    async setDeviceHostFileName(deviceId, hostFileName) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.hostFileName = hostFileName;

        this.deviceInfo[deviceId] = info;

        await fileUtil.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    // 获取用户绑定的clientip
    getDeviceListBindedToUserId(userId) {
        let deviceList = [];
        _.forEach(this.deviceInfo, (info, deviceId) => {
            if (info.userId == userId) {
                deviceList.push(info);
            }
        });
        return deviceList;
    }

    canSocksProxy(userId, host, ip) {
        let ipMap = this._getSocksProxyMap(userId);
        if (ipMap['0.0.0.0']) return true;
        return ipMap[ip];
    }

    _getSocksProxyMap(userId) {
        if (this._socksProxyCahce[userId]) {
            return this._socksProxyCahce[userId];
        }
        let content = this.getProfile(userId).socksProxyNeedParseIp;
        this._socksProxyCahce[userId] = this._parseIp(content);
        return this._socksProxyCahce[userId];
    }

    _parseIp(content) {
        let result = {};
        let lines = content.replace(/#.*/g, '').split(/[\r\n]/);
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            let ip = line.trim();
            if (ip) {
                result[ip] = 1;
            }
        }
        return result;
    }
};
