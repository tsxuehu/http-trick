const EventEmitter = require("events");
const _ = require("lodash");
const path = require("path");
const fileUtil = require("../../core/utils/file");
const DnsResolver = require("../../core/utils/dns");

const ipReg = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/;

/**
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class HostService extends EventEmitter {
    constructor({profileService, appInfoService}) {
        super();
        // userId -> { filename -> content}
        this.userHostFilesMap = {};
        // 缓存
        // userId, {globHostMap, hostMap}
        this._userHostsCache = {};
        let proxyDataDir = appInfoService.getProxyDataDir();
        this.hostSaveDir = path.join(proxyDataDir, "host");

        this.profileService = profileService;
        // dns解析服务
        this.dns = new DnsResolver({});
    }

    async start() {
        // 读取host配置
        let contentMap = await fileUtil.getJsonFileContentInDir(this.hostSaveDir);
        _.forEach(contentMap, (content, fileName) => {
            let hostName = content.name;
            let userId = fileName.substr(0, this._getUserIdLength(fileName, hostName));
            this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
            this.userHostFilesMap[userId][hostName] = content;
        });
    }

    async resolveHostDirect(userId, hostname) {
        let result = await this.resolveHostWithWay(userId, '', hostname);

        return result.ip;
    }

    async resolveHostWithWay(userId, deviceId, hostname) {
        let ip = '';
        let way = '';
        if (!hostname) return hostname;

        if (ipReg.test(hostname)) {
            way = 'hostname is ip';
            ip = hostname;
        } else if (this.profileService.enableHost(userId)) {
            // 解析host
            let device = this.profileService.getDevice(deviceId);
            let inUsingHosts = {};
            if (device && device.hostFileName) {
                way = 'device-' + device.hostfileName + ' ';
                inUsingHosts = this.getSpecificHosts(userId, device.hostFileName)
            } else {
                inUsingHosts = this.getDefaultHosts(userId);
                way = 'default-' + inUsingHosts.name + ' ';
            }
            ip = inUsingHosts.hostMap[hostname];
            if (!ip) {
                // 配置 *开头的host  计算属性globHostMap已经将*去除
                ip = _.find(inUsingHosts.globHostMap, (value, host) => {
                    return hostname.endsWith(host);
                });
            }
        }

        if (!ip) {
            way += 'dns';
            // 调用dns解析
            ip = await this.dns.resovleIp(hostname);
        }

        return {
            way, ip
        };
    }

    /**
     * 获取用户生效的host
     * @param userId
     * @returns {*}
     */
    getDefaultHosts(userId) {
        if (!this._userHostsCache[userId]) {
            this._userHostsCache[userId] = {};
        }
        let hosts = this._userHostsCache[userId].defaultHost;
        if (!hosts) {
            let fileList = this.getHostFileList(userId);
            // 找到启用的文件
            let findedUsingHost = _.find(fileList, (fileMeta) => {
                return fileMeta.checked;
            });
            let name = (findedUsingHost || {}).name || '';
            hosts = this.getSpecificHosts(userId, name);
            hosts.name = name
            this._userHostsCache[userId].defaultHost = hosts;
        }
        return hosts;
    }

    getSpecificHosts(userId, hostFileName) {
        if (!this._userHostsCache[userId]) {
            this._userHostsCache[userId] = {};
        }
        let hosts = this._userHostsCache[userId][hostFileName];
        if (!hosts) {
            // 读文件加载host
            let hostMap = {};
            let globHostMap = {};

            let fileContent = this.getHostFile(userId, hostFileName);
            if (fileContent) {
                // 解析host
                let parsed = this._parseHost(fileContent.content);
                _.forEach(parsed, (hosts, ip) => {
                    hosts.forEach(host => {
                        if (host.startsWith('*')) {
                            globHostMap[host.substr(1, host.length)] = ip;
                        } else {
                            hostMap[host] = ip;
                        }
                    })
                });
            }

            hosts = {
                hostMap, globHostMap
            };
            this._userHostsCache[userId][hostFileName] = hosts;
        }
        return hosts;
    }

    getHostFile(userId, name) {
        // 如果找不到文件，则去默认文件里查找
        return (this.userHostFilesMap[userId] || {})[name];
    }

    /**
     * 获取用户的host文件列表
     * @param userId
     * @returns {Array}
     */
    getHostFileList(userId) {
        // 添加默认文件
        let fileList = [];
        _.forEach(this.userHostFilesMap[userId], (content, key) => {
            fileList.push({
                name: content.name,
                checked: content.checked,
                description: content.description,
                meta: content.meta
            });
        });
        return fileList;
    }

    /**
     * 创建host文件
     * @param userId
     * @param name
     * @param description
     * @returns {boolean}
     */
    async createHostFile(userId, name, description) {
        if (this.userHostFilesMap[userId] && this.userHostFilesMap[userId][name]) {
            // 文件已经存在不让创建
            return false;
        }
        if (name == 'defaultHost') {
            name += 'not-allow-defaultHost'
        }

        let content = {
            "meta": {
                "local": true
            },
            "readonly": false,
            "checked": false,
            "name": name,
            "description": description,
            "content": ''
        };
        this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
        this.userHostFilesMap[userId][name] = content;

        let hostfileName = this._getHostFilePath(userId, name);
        await fileUtil.writeJsonToFile(hostfileName, content);

        this.emit("data-change", userId, this.getHostFileList(userId));
        this.emit("host-saved", userId, name, content);
        return true;
    }

    deleteHostFile(userId, name) {
        delete this.userHostFilesMap[userId][name];
        delete this._userHostsCache[userId].defaultHost;
        delete this._userHostsCache[userId][name];
        /**
         * 删除文件
         */
        this.emit("data-change", userId, this.getHostFileList(userId));
        this.emit("host-deleted", userId, name);
    }

    async setUseHost(userId, filename) {
        let toSaveFileName = [];
        _.forEach(this.userHostFilesMap[userId], (content, name) => {
            if (content.name == filename && content.checked != true) {
                content.checked = true;
                toSaveFileName.push(name);
            } else if (content.name != filename && content.checked != false) {
                content.checked = false;
                toSaveFileName.push(name);
            }

        });
        // 保存文件
        for (let name of toSaveFileName) {
            let hostfileName = this._getHostFilePath(userId, name);
            let content = this.userHostFilesMap[userId][name];
            await fileUtil.writeJsonToFile(hostfileName, content);
        }
        delete this._userHostsCache[userId].defaultHost;
        this.emit("data-change", userId, this.getHostFileList(userId));
    }


    async saveHostFile(userId, name, content) {
        this.userHostFilesMap[userId][name] = content;

        // 删除缓存
        delete this._userHostsCache[userId][name];

        let hostfileName = this._getHostFilePath(userId, name);
        await fileUtil.writeJsonToFile(hostfileName, content);
        this.emit("host-saved", userId, name, content);
    }


    _getHostFilePath(userId, hostName) {
        let fileName = `${userId}_${hostName}.json`;
        let filePath = path.join(this.hostSaveDir, fileName);
        return filePath;
    }

    _getUserIdLength(ruleFileName, hostName) {
        return ruleFileName.length - hostName.length - 6;
    }

    _parseHost(content) {
        let result = {};
        let lines = content.replace(/#.*/g, '').split(/[\r\n]/);
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            let md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
            if (md) {
                result[md[1]] = _.union(result[md[1]] || [], md[2].trim().split(/\s+/));
            }
        }
        return result;
    }
};
