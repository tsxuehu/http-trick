const EventEmitter = require("events");
const _ = require("lodash");
/**
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class HostRepository extends EventEmitter {
    constructor(userRepository) {
        super();
        // 用户 -> host列表
        this.userHostFilesMap = {};
        // 缓存
        this.userHostFileList = {};
        // 缓存
        // userId, {globHostMap, hostMap}
        this.inUsingHostsMap = {};
        this.userRepository = userRepository;
    }

    async resolveHost(clientIp, hostname) {
        if (!hostname) return hostname;
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
        let inUsingHosts = await this.getInUsingHosts(userId);
        let ip = inUsingHosts.hostMap[hostname];
        if (ip) return ip;
        // 配置 *开头的host  计算属性globHostMap已经将*去除
        ip = _.find(inUsingHosts.globHostMap, (value, host) => {
            return hostname.endsWith(host);
        });
        return ip || hostname;
    }

    getInUsingHosts(userId) {
        let hosts = this.inUsingHostsMap[userId];
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
            this.inUsingHostsMap[userId] = hosts;
        }
        return hosts;
    }


    getHostFileList(userId) {
        let fileList = this.userHostFileList[userId];
        if (!fileList) {
            fileList = [];
            _.forEach(this.userHostFilesMap[userId], (content, key) => {
                fileList.push({
                    name: content.name,
                    checked: content.checked,
                    description: content.description,
                    meta: content.meta
                })
            });
            this.userHostFileList[userId] = fileList;
        }

        return fileList;
    }

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
        // 删除缓存
        delete this.userHostFileList[userId];

        this.emit("data-change", userId, this.getHostFileList(userId));
        this.emit("host-saved", userId, name, content);
        return true;
    }

    deleteHostFile(userId, name) {
        delete this.userHostFilesMap[userId][name];
        delete this.userHostFileList[userId];
        delete this.inUsingHostsMap[userId];
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
        delete this.userHostFileList[userId];
        delete this.inUsingHostsMap[userId];
        this.emit("data-change", userId, this.getHostFileList(userId));
    }

    getHostFile(userId, name) {
        return this.userHostFilesMap[userId][name];
    }

    saveHostFile(userId, name, content) {
        this.userHostFilesMap[userId][name] = content;
        this.emit("host-saved", userId, name, content);
    }
}