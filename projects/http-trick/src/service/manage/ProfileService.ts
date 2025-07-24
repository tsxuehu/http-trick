import {Resource, Service} from "di/annotation";
import {defaultProfile, IDeviceInfo, IUserProfile, IProxyConfig} from "./profile";
import FileService from "service/infra/FileService";
import path from "path";
import AppInfoService from "service/AppInfoService";
import forEach from "lodash/forEach";
import assign from "lodash/assign";
import template from "lodash/template";
import find from "lodash/find";
import EventEmitter from "events";

@Service()
export default class ProfileService extends EventEmitter {
    @Resource() private fileService: FileService
    @Resource() private appInfoService: AppInfoService

    private userProfileMap: Record<string, IUserProfile> = {} // userId -> profile
    private deviceInfo: Record<string, IDeviceInfo> = {} // deviceId -> info { userId: , name: '', id: ''}
    private _gothroughProxyCahce: Record<string, any> = {} // 用户socks配置缓存
    private profileSaveDir: string
    private deviceInfoSaveFile: string
    private pacTemplate: (param: any) => string

    async start() {
        const appDir = this.appInfoService.getAppDir();
        const dataDir = this.appInfoService.getProxyDataDir();

        this.profileSaveDir = path.join(dataDir, "profile");
        this.deviceInfoSaveFile = path.join(dataDir, "deviceInfo.json");

        defaultProfile.goThroughProxyConfig =
            await this.fileService.readFile(path.resolve(appDir, 'assets/go-through-proxy-example.txt'));

        // =======================
        let profileMap = await this.fileService.getJsonFileContentInDir<IUserProfile>(this.profileSaveDir);
        forEach(profileMap, (profile, fileName) => {
            let userId = fileName.slice(0, -5);
            // 补全profile数据
            this.userProfileMap[userId] = assign({}, defaultProfile, profile);
        });
        // 加载deviceId-> userID映射
        this.deviceInfo = await this.fileService.readJsonFromFile(this.deviceInfoSaveFile);

        // 加载pac文件模版
        let pacTemplateFile = await this.fileService.readFile(path.resolve(appDir, 'assets/proxy.pac.template.js'));
        this.pacTemplate = template(pacTemplateFile);
    }

    // =========================== 运行时判断
    shoudGoThrougProxy(userId: string, host: string): boolean {
        let {hostMap, globHostArray} = this._getGoThroughProxyMap(userId);
        if (hostMap['all']) return true;
        if (hostMap[host]) {
            return true;
        }

        let finded = find(globHostArray, (value) => {
            return host.endsWith(value);
        });
        return !!finded;
    }

    // =========================== 生成pac脚本
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_(PAC)_file
    generateProxyPacFile(userId: string, proxyIp: string) {
        const {
            startSocks5,
            startHttpProxy,
            pcIp,
            socks5ProxyPort,
            httpProxyPort
        } = this.appInfoService.getAppInfo();
        let proxy = 'DIRECT';
        let all = false;
        let {hostMap, globHostArray} = this._getGoThroughProxyMap(userId);
        if (hostMap['all']) {
            all = true;
        }
        if (startSocks5) {
            proxy = `SOCKS5 ${proxyIp || pcIp}:${socks5ProxyPort}`
        } else if (startHttpProxy) {
            proxy = `PROXY ${proxyIp || pcIp}:${httpProxyPort}`
        }
        let pac = this.pacTemplate({
            all,
            proxy,
            hostMap: JSON.stringify(hostMap, null, 2),
            globHostArray: JSON.stringify(globHostArray, null, 2)
        });
        return pac;
    }

    private _getGoThroughProxyMap(userId: string) {
        if (this._gothroughProxyCahce[userId]) {
            return this._gothroughProxyCahce[userId];
        }
        let content = this.getProfile(userId).goThroughProxyConfig;
        this._gothroughProxyCahce[userId] = this._parseHost(content);
        return this._gothroughProxyCahce[userId];
    }

    private _parseHost(content: string) {
        let result = [];
        let lines = content.replace(/#.*/g, '').split(/[\r\n]/);
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            let host = line.trim();
            if (host) {
                result.push(host);
            }
        }
        let globHostArray: string[] = [];
        let hostMap: Record<string, number> = {};
        forEach(result, (host) => {
            if (host.startsWith('*')) {
                globHostArray.push(host.substring(1));
            } else {
                hostMap[host] = 1;
            }
        });
        return {
            hostMap, globHostArray
        };
    }

    // =========================== 用户profile管理
    getProfile(userId: string): IUserProfile {
        return this.userProfileMap[userId] || defaultProfile;
    }

    async setProfile(userId: string, profile: IUserProfile) {
        this.userProfileMap[userId] = profile;
        delete this._gothroughProxyCahce[userId];

        let filePath = path.resolve(this.profileSaveDir, `${userId}.json`);
        // 将数据写入文件
        await this.fileService.writeJsonToFile(filePath, profile);
        // 发送通知
        this.emit('data-change-profile', userId, profile);
    }

    /**
     * 替换redirect中的变量引用,
     * 如果引用的变量不存在，则不做替换
     */
    calcPath(userId: string, href: string, match: string, target: string): string {
        if (match) {

            let matchList = href.match(new RegExp(match));

            forEach(matchList, function (value, index) {
                if (index == 0) return;
                var reg = new RegExp('\\$' + index, 'g');
                if (value === undefined) value = '';
                target = target.replace(reg, value);
            });

            let compiled = template(target, {
                //  interpolate: /{{([\s\S]+?)}}/g
            });
            let redirectPathVariables = this.getProfile(userId).redirectPathVariables;
            // 解析应用的变量
            return compiled(redirectPathVariables);
        }
    }

    async setEnableRule(userId: string, enable: boolean): Promise<void> {
        const conf = this.getProfile(userId);
        conf.enableRule = enable;
        await this.setProfile(userId, conf);
    }

    async setEnableHost(userId: string, enable: boolean): Promise<void> {
        let conf = this.getProfile(userId);
        conf.enableHost = enable;
        await this.setProfile(userId, conf);
    }

    async setResolveHost(userId: string, enable: boolean): Promise<void> {
        let conf = this.getProfile(userId);
        conf.resolveHost = enable;
        await this.setProfile(userId, conf);
    }

    async setEnableFilter(userId: string, enable: boolean): Promise<void> {
        let conf = this.getProfile(userId);
        conf.enableFilter = enable;
        await this.setProfile(userId, conf);
    }

    enableRule(userId: string): boolean {
        return this.getProfile(userId).enableRule;
    }

    enableHost(userId: string): boolean {
        return this.getProfile(userId).enableHost;
    }

    enableFilter(userId: string): boolean {
        return this.getProfile(userId).enableFilter;
    }

    getExternalHttpProxyByUserId(userId: string): IProxyConfig {
        let profile = this.getProfile(userId);
        if (!profile.externalProxy) {
            return;
        }
        if (profile.externalSocks5Proxy) {
            return {
                hasExternalProxy: true,
                proxyType: 'socks5',
                proxyIp: profile.socks5ProxyIp,
                proxyPort: profile.socks5ProxyPort
            }
        } else if (profile.externalHttpProxy) {
            return {
                hasExternalProxy: true,
                proxyType: 'http',
                proxyIp: profile.httpProxyIp,
                proxyPort: profile.httpProxyPort
            }
        }
    }

    getExternalHttpProxyByDeviceInfo(device: IDeviceInfo): IProxyConfig {
        if (!device || !device.externalProxy) {
            return;
        }
        if (device.externalSocks5Proxy) {
            return {
                hasExternalProxy: true,
                proxyType: 'socks5',
                proxyIp: device.socks5ProxyIp,
                proxyPort: device.socks5ProxyPort
            }
        } else if (device.externalHttpProxy) {
            return {
                hasExternalProxy: true,
                proxyType: 'http',
                proxyIp: device.httpProxyIp,
                proxyPort: device.httpProxyPort
            }
        }
    }

    getExternalProxy(userId: string, deviceId: string): IProxyConfig {
        const device = this.getDevice(deviceId);
        let proxy = this.getExternalHttpProxyByDeviceInfo(device);
        if (proxy) return proxy;
        if (device && !device.externalProxyCanUseUserSetting) {
            return {hasExternalProxy: false};
        }
        proxy = this.getExternalHttpProxyByUserId(userId);
        return proxy || {hasExternalProxy: false};
    }

    getDevice(deviceId: string): IDeviceInfo {
        return this.deviceInfo[deviceId];
    }

    getUserIdBindDevice(deviceId: string): string {
        let info = this.deviceInfo[deviceId];
        if (!info || !info.userId) {
            return 'root'
        }
        return info.userId;
    }

    isDeviceEnableMonitor(deviceId: string) {
        let info = this.deviceInfo[deviceId];
        if (!info) return true;
        return !info.disableMonitor;
    }

    getDeviceInfoSetDefaultIfPossible(deviceId: string): IDeviceInfo {
        let info = this.deviceInfo[deviceId];
        if (!info) {
            info = this.deviceInfo[deviceId] = {
                id: deviceId,
                userId: '',
                name: deviceId,
                disableMonitor: false,
                hostFileName: '',
                externalProxyCanUseUserSetting: true,
                externalProxy: false,
                externalHttpProxy: false,
                externalSocks5Proxy: false,
                httpProxyIp: '',
                httpProxyPort: 8888,
                socks5ProxyIp: '',
                socks5ProxyPort: 8889
            };
        }
        return info;
    }

    async setDeviceName(deviceId: string, name: string) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.name = name;

        this.deviceInfo[deviceId] = info;

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    async setDeviceHostFileName(deviceId: string, hostFileName: string) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.hostFileName = hostFileName;

        this.deviceInfo[deviceId] = info;

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    async setDisableMonitor(deviceId: string, disableMonitor: boolean) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        info.disableMonitor = disableMonitor;

        this.deviceInfo[deviceId] = info;

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(info.userId);
        this.emit('data-change-deviceList', info.userId, deviceList);
    }

    async setDeviceProxyInfo(deviceId: string, config: {
        canUseUserSetting: boolean;
        enable: boolean;
        type: string;
        ip: string;
        port: number
    }) {

        let device = this.getDeviceInfoSetDefaultIfPossible(deviceId);

        device.externalProxyCanUseUserSetting = config.canUseUserSetting || false;
        device.externalProxy = !!config.enable;

        if (config.type) {
            device.externalHttpProxy = config.type == 'http';
            device.externalSocks5Proxy = config.type != 'http';
        }

        let hasIpPort = config.ip && config.port;
        if (device.externalHttpProxy && hasIpPort) {
            device.httpProxyIp = config.ip || device.httpProxyIp;
            device.httpProxyPort = +config.port || device.httpProxyPort;
        }
        if (device.externalSocks5Proxy && hasIpPort) {
            device.socks5ProxyIp = config.ip || device.socks5ProxyIp;
            device.socks5ProxyPort = +config.port || device.socks5ProxyPort;
        }

        this.deviceInfo[deviceId] = device;

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(device.userId);
        this.emit('data-change-deviceList', device.userId, deviceList);
    }

    getDeviceProxyInfo(deviceId: string) {
        let enable = false;
        let type = 'socks5';
        let ip = '';
        let port = 8889;
        let device = this.getDevice(deviceId);

        if (device) {
            enable = !!device.externalProxy;
            type = device.externalSocks5Proxy ? 'socks5' : 'http';
            if (device.externalSocks5Proxy) {
                ip = device.socks5ProxyIp;
                port = device.socks5ProxyPort || 8889;
            } else {
                ip = device.httpProxyIp;
                port = device.httpProxyPort || 8888;
            }
        }
        return {
            enable, type, ip: ip + '', port: port + ''
        }
    }

    getDeviceListBindedToUserId(userId: string): IDeviceInfo[] {
        const deviceList: IDeviceInfo[] = [];
        forEach(this.deviceInfo, (info, deviceId) => {
            if (info.userId == userId) {
                deviceList.push(info);
            }
        });
        return deviceList;
    }

    async bindDevice(userId: string, deviceId: string) {
        let info = this.getDeviceInfoSetDefaultIfPossible(deviceId);
        let originUserId = info.userId;
        if (userId == originUserId) {
            return
        }
        info.userId = userId;
        this.deviceInfo[deviceId] = info;

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        let deviceList = this.getDeviceListBindedToUserId(userId);
        this.emit('data-change-deviceList', userId, deviceList);

        if (originUserId) {
            let originClientIpList = this.getDeviceListBindedToUserId(originUserId);
            this.emit('data-change-deviceList', originUserId, originClientIpList);
        }
    }

    // 解除绑定至用户
    async unbindDevice(deviceId: string) {
        let info = this.deviceInfo[deviceId];
        delete this.deviceInfo[deviceId];

        await this.fileService.writeJsonToFile(this.deviceInfoSaveFile, this.deviceInfo);

        if (info) {
            let originDeviceList = this.getDeviceListBindedToUserId(info.userId);
            this.emit('data-change-deviceList', info.userId, originDeviceList);
        }
    }
}
