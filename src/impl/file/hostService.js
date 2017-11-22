const EventEmitter = require("events");
const _ = require("lodash");
const path = require("path");
const fileUtil = require("../../core/utils/file");
/**
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class HostService extends EventEmitter {
    constructor({appInfoService}) {
        super();
        // userId -> { filename -> content}
        this.userHostFilesMap = {};
        // 缓存
        // userId, {globHostMap, hostMap}
        this._inUsingHostsMapCache = {};
        let proxyDataDir = appInfoService.getProxyDataDir();
        this.hostSaveDir = path.join(proxyDataDir, "host");
    }

    async start() {
        // 读取host配置
        let contentMap = await fileUtil.getJsonFileContentInDir(this.hostSaveDir);
        _.forEach(contentMap, (content, fileName) => {
            let hostName = content.name;
            let userId = fileName.substr(0, this._getUserIdLength(fileName, hostName));
            this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
            this.userHostFilesMap[userId][hostName] = content;
        })
    }

    async resolveHost(userId, hostname) {
        if (!hostname) return hostname;
        let inUsingHosts = this.getInUsingHosts(userId);

        let ip = inUsingHosts.hostMap[hostname];
        if (ip) return ip;
        // 配置 *开头的host  计算属性globHostMap已经将*去除
        ip = _.find(inUsingHosts.globHostMap, (value, host) => {
            return hostname.endsWith(host);
        });
        return ip || hostname;
    }

    /**
     * 获取用户生效的host
     * @param userId
     * @returns {*}
     */
    getInUsingHosts(userId) {
        let hosts = this._inUsingHostsMapCache[userId];
        if (!hosts) {
            // 读文件加载host
            let hostMap = {};
            let globHostMap = {};
            let findedUsingHost = _.find(this.userHostFilesMap[userId], (content) => {
                return content.checked;
            });
            if (findedUsingHost) {
                _.forEach(findedUsingHost.content, (ip, host) => {
                    if (host.startsWith('*')) {
                        globHostMap[host.substr(1, host.length)] = ip;
                    } else {
                        hostMap[host] = ip;
                    }
                });
            }
            hosts = {
                hostMap, globHostMap
            };
            this._inUsingHostsMapCache[userId] = hosts;
        }
        return hosts;
    }

    /**
     * 获取用户的host文件列表
     * @param userId
     * @returns {Array}
     */
    getHostFileList(userId) {
        let fileList = [];
        _.forEach(this.userHostFilesMap[userId], (content, key) => {
            fileList.push({
                name: content.name,
                checked: content.checked,
                description: content.description,
                meta: content.meta
            })
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
    createHostFile(userId, name, description) {
        if (this.userHostFilesMap[userId][name]) {
            // 文件已经存在不让创建
            return false;
        }

        let content = {
            "meta": {
                "local": true
            },
            "checked": false,
            "name": name,
            "description": description,
            "content": {}
        };
        this.userHostFilesMap[userId][name] = content;

        let hostfileName = this._getHostFilePath(userId,name);

        this.emit("data-change", userId, this.getHostFileList(userId));
        this.emit("host-saved", userId, name, content);
        return true;
    }

    deleteHostFile(userId, name) {
        delete this.userHostFilesMap[userId][name];
        delete this._inUsingHostsMapCache[userId];
        /**
         * 删除文件
         */

        this.emit("data-change", userId, this.getHostFileList(userId));
        this.emit("host-deleted", userId, name);
    }

    setUseHost(userId, filename) {
        _.forEach(this.userHostFilesMap[userId], (content, name) => {
            if (content.name == filename) {
                content.checked = true;
            } else {
                content.checked = false;
            }

        });
        // 保存文件
        delete this._inUsingHostsMapCache[userId];
        this.emit("data-change", userId, this.getHostFileList(userId));
    }

    getHostFile(userId, name) {
        return this.userHostFilesMap[userId][name];
    }

    saveHostFile(userId, name, content) {
        this.userHostFilesMap[userId][name] = content;
        this.emit("host-saved", userId, name, content);
    }

    _getHostFilePath(userId, hostName) {
        let fileName = `${userId}_${hostName}.json`;
        let filePath = path.join(this.ruleSaveDir, fileName);
        return filePath;
    }

    _getUserIdLength(ruleFileName, hostName) {
        return ruleFileName.length - hostName.length - 6;
    }
};