import {Resource, Service} from "di/annotation";
import FileService from "service/infra/FileService";
import AppInfoService from "service/AppInfoService";
import forEach from "lodash/forEach";
import find from "lodash/find";
import union from "lodash/union";
import path from "path";
import {IHostFile, IHostFileCacheItem, IHostFileListItem} from "service/manage/host";
import EventEmitter from "events";
import {v4 as uuidV4} from 'uuid';

@Service()
export default class HostDataService extends EventEmitter {
    @Resource() private fileService: FileService
    @Resource() private appInfoService: AppInfoService


    private userHostFilesMap: Record<string, Record<string, IHostFile>> = {} // userId -> { file id -> content}
    private _userHostsCache: Record<string, Record<string, IHostFileCacheItem>> = {} // userId, {globHostMap, hostMap}

    private hostSaveDir: string

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.hostSaveDir = path.resolve(dataDir, "host");

        const contentMap = await this.fileService.getJsonFileContentInDir(this.hostSaveDir);

        forEach(contentMap, (content, fileName) => {
            let id = content.id;
            let userId = content.userId;
            this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
            this.userHostFilesMap[userId][id] = content;
        });
    }

    getCurrentUsingHosts(userId: string): IHostFileCacheItem {
        if (!this._userHostsCache[userId]) {
            this._userHostsCache[userId] = {};
        }
        let hosts = this._userHostsCache[userId].currentUsingHosts;
        if (!hosts) {
            let fileList = this.getHostFileList(userId);
            // 找到启用的文件
            let findedUsingHost = find(fileList, (fileMeta) => {
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

    getHostFile(userId: string, id: string): IHostFile {
        // 如果找不到文件，则去默认文件里查找
        return (this.userHostFilesMap[userId] || {})[id];
    }

    getSpecificHosts(userId: string, id: string) {
        if (!this._userHostsCache[userId]) {
            this._userHostsCache[userId] = {};
        }
        let hosts = this._userHostsCache[userId][id];
        if (!hosts) {
            // 读文件加载host
            let hostMap: Record<string, string> = {};
            let globHostMap: Record<string, string> = {};

            let fileContent = this.getHostFile(userId, id);
            if (fileContent) {
                // 解析host
                let parsed = this._parseHost(fileContent.content);
                forEach(parsed, (hosts, ip) => {
                    hosts.forEach(host => {
                        if (host.startsWith('*')) {
                            globHostMap[host.substring(1)] = ip;
                        } else {
                            hostMap[host] = ip;
                        }
                    })
                });
            }

            hosts = {
                name: fileContent.name,
                hostMap, globHostMap
            };
            this._userHostsCache[userId][id] = hosts;
        }
        return hosts;
    }

    _parseHost(content: string) {
        let result: Record<string, string[]> = {};
        let lines = content.replace(/#.*/g, '').split(/[\r\n]/);
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            let md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
            if (md) {
                result[md[1]] = union(result[md[1]] || [], md[2].trim().split(/\s+/));
            }
        }
        return result;
    }

    getHostFileList(userId: string) {
        // 添加默认文件
        const fileList: IHostFileListItem[] = [];
        forEach(this.userHostFilesMap[userId], (content, key) => {
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

    async createHostFile(userId: string, name: string, description: string) {
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
        await this.fileService.writeJsonToFile(hostfileName, content);

        this.emit("data-change", userId, this.getHostFileList(userId));
        // this.emit("host-saved", userId, name, content);
        return hostFileId;
    }

    async deleteHostFile(userId: string, id: string) {
        let path = this._getHostFilePath(userId, id);
        await this.fileService.deleteFile(path);

        delete this.userHostFilesMap[userId][id];
        this._userHostsCache[userId] && delete this._userHostsCache[userId].currentUsingHosts;
        this._userHostsCache[userId] && delete this._userHostsCache[userId][id];
        /**
         * 删除文件
         */
        this.emit("data-change", userId, this.getHostFileList(userId));
        // this.emit("host-deleted", userId, id);
    }

    async setUseHost(userId: string, hostFileId: string) {
        let toSaveFileId: string[] = [];
        let toUseFileFinded = false;
        if (!this.userHostFilesMap[userId]) {
            this.userHostFilesMap[userId] = {};
        }
        forEach(this.userHostFilesMap[userId], (content, id) => {
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
            await this.fileService.writeJsonToFile(hostfileName, content);
        }
        this._userHostsCache[userId] && delete this._userHostsCache[userId].currentUsingHosts;
        this.emit("data-change", userId, this.getHostFileList(userId));
    }


    async saveHostFile(userId: string, hostFileId: string, content: IHostFile) {
        let needNotify = false;
        if (!hostFileId) {
            needNotify = true;
            hostFileId = uuidV4();
            content.id = hostFileId;
            content.userId = userId;
        }
        this.userHostFilesMap[userId] = this.userHostFilesMap[userId] || {};
        this.userHostFilesMap[userId][hostFileId] = content;

        // 删除缓存
        delete this._userHostsCache[userId];

        let hostfileName = this._getHostFilePath(userId, hostFileId);
        await this.fileService.writeJsonToFile(hostfileName, content);
        if (needNotify) {
            this.emit("data-change", userId, this.getHostFileList(userId));
        }
        // this.emit("host-saved", userId, hostFileId, content);
    }

    _getHostFilePath(userId: string, hostFileId: string) {
        const fileName = `${userId}_${hostFileId}.json`;
        return path.join(this.hostSaveDir, fileName);
    }
}
