const EventEmitter = require("events");
const net = require('net');
const _ = require("lodash");
const path = require("path");
const fileUtil = require("../utils/file");
const DnsResolver = require("../utils/dns");
const uuidV4 = require('uuid/v4');
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
      let id = content.id;
      let userId = content.userId;
      this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
      this.userHostFilesMap[userId][id] = content;
    });
  }

  async resolveHostDirect(userId, hostname, deviceId) {
    let result = await this.resolveHostWithWay(userId, deviceId, hostname);

    return result.ip;
  }

  async resolveHostWithoutProfile(hostname) {
    let ip = await this.dns.resovleIp(hostname);
    return ip;
  }

  isIp(str) {
    if (net.isIP(str)) {
      return true
    }
    return false;
  }

  async resolveHostWithWay(userId, deviceId, hostname) {
    let ip = '';
    let way = '';
    if (!hostname) return false;

    if (this.isIp(hostname)) {
      way = 'hostname is ip';
      ip = hostname;
    } else if (this.profileService.enableHost(userId)) {
      // 解析host
      let inUsingHosts;
      inUsingHosts = this.getCurrentUsingHosts(userId);
      way = 'user-' + encodeURIComponent(inUsingHosts.name) + ' ';

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
  getCurrentUsingHosts(userId) {
    if (!this._userHostsCache[userId]) {
      this._userHostsCache[userId] = {};
    }
    let hosts = this._userHostsCache[userId].currentUsingHosts;
    if (!hosts) {
      let fileList = this.getHostFileList(userId);
      // 找到启用的文件
      let findedUsingHost = _.find(fileList, (fileMeta) => {
        return fileMeta.checked;
      });
      let name = (findedUsingHost || {}).name || '';
      let id = (findedUsingHost || {}).id || '';
      hosts = this.getSpecificHosts(userId, id);
      hosts.name = name;
      this._userHostsCache[userId].currentUsingHosts = hosts;
    }
    return hosts;
  }

  getSpecificHosts(userId, id) {
    if (!this._userHostsCache[userId]) {
      this._userHostsCache[userId] = {};
    }
    let hosts = this._userHostsCache[userId][id];
    if (!hosts) {
      // 读文件加载host
      let hostMap = {};
      let globHostMap = {};

      let fileContent = this.getHostFile(userId, id);
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
      this._userHostsCache[userId][id] = hosts;
    }
    return hosts;
  }

  getHostFile(userId, id) {
    // 如果找不到文件，则去默认文件里查找
    let file = (this.userHostFilesMap[userId] || {})[id];
    return file;
  }

  /**
   * 获取用户的host文件列表
   * @param userId
   * @returns {Array}
   */
  getHostFileList(userId) {
    // 添加默认文件
    let fileList = [];
    let nameMap = {};
    _.forEach(this.userHostFilesMap[userId], (content, key) => {
      nameMap[content.name] = 1;
      fileList.push({
        id: content.id,
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

    let hostFileId = uuidV4();
    let content = {
      "meta": {
        "local": true
      },
      "id": hostFileId,
      "userId": userId,
      "readonly": false,
      "default": false,
      "checked": false,
      "name": name,
      "description": description,
      "content": ''
    };
    this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
    this.userHostFilesMap[userId][hostFileId] = content;

    let hostfileName = this._getHostFilePath(userId, hostFileId);
    await fileUtil.writeJsonToFile(hostfileName, content);

    this.emit("data-change", userId, this.getHostFileList(userId));
    this.emit("host-saved", userId, name, content);
    return hostFileId;
  }

  deleteHostFile(userId, id) {
    let fileContent = this.userHostFilesMap[userId][id];
    if (fileContent.default) {
      throw new Error('默认文件不允许删除');
    }
    delete this.userHostFilesMap[userId][id];
    this._userHostsCache[userId] && delete this._userHostsCache[userId].currentUsingHosts;
    this._userHostsCache[userId] && delete this._userHostsCache[userId][id];
    /**
     * 删除文件
     */
    this.emit("data-change", userId, this.getHostFileList(userId));
    this.emit("host-deleted", userId, id);
  }

  async setUseHost(userId, hostFileId) {
    let toSaveFileId = [];
    let toUseFileFinded = false;
    if (!this.userHostFilesMap[userId]) {
      this.userHostFilesMap[userId] = {};
    }
    _.forEach(this.userHostFilesMap[userId], (content, id) => {
      if (content.id == hostFileId && content.checked != true) {
        content.checked = true;
        toUseFileFinded = true;
        toSaveFileId.push(content.id);
      } else if (content.id != hostFileId && content.checked != false) {
        content.checked = false;
        toSaveFileId.push(content.id);
      }
    });
    // 保存文件
    for (let id of toSaveFileId) {
      let hostfileName = this._getHostFilePath(userId, id);
      let content = this.userHostFilesMap[userId][id];
      await fileUtil.writeJsonToFile(hostfileName, content);
    }
    this._userHostsCache[userId] && delete this._userHostsCache[userId].currentUsingHosts;
    this.emit("data-change", userId, this.getHostFileList(userId));
  }


  async saveHostFile(userId, hostFileId, content) {
    if (!hostFileId) {
      hostFileId = uuidV4();
      content.id = hostFileId;
      content.userId = userId;
    }

    this.userHostFilesMap[userId][hostFileId] = content;

    // 删除缓存
    delete this._userHostsCache[userId];

    let hostfileName = this._getHostFilePath(userId, hostFileId);
    await fileUtil.writeJsonToFile(hostfileName, content);
    this.emit("host-saved", userId, hostFileId, content);
  }

  _getHostFilePath(userId, hostFileId) {
    let fileName = `${userId}_${hostFileId}.json`;
    let filePath = path.join(this.hostSaveDir, fileName);
    return filePath;
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
