const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');

const defaultConfigure = {
    "gitlabToken": "",
    "proxyPort": 8001,
    "socks5Port": 8002,
    "requestTimeoutTime": 30000,
    "socksProxy": '0.0.0.0',
};
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ConfigureService extends EventEmitter {
    constructor({appInfoService}) {
        super();
        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        this.configureFile = path.join(proxyDataDir, "configure.json");
        this.configure = {};
        this._socksProxyCahce = null;
    }

    async start() {
        let customConfigure = await fileUtil.readJsonFromFile(this.configureFile);
        this.configure = _.assign({}, defaultConfigure, customConfigure);
    }

    // 获取配置
    getConfigure() {
        return this.configure;
    }

    // 设置配置，保存到文件
    async setConfigure(userId, configure) {
        this.configure = configure;
        this._socksProxyCahce = null;
        await fileUtil.writeJsonToFile(this.configureFile, this.configure);
        // 发送通知
        this.emit('data-change', userId, this.configure);
    }

    // 获取代理端口
    getProxyPort() {
        return this.configure.proxyPort;
    }

    getSocks5Port() {
        return this.configure.socks5Port;
    }

    canSocksProxy(host, ip) {
        let ipMap = this._getSocksProxyMap();
        if (ipMap['0.0.0.0']) return true;
        return ipMap[ip];
    }

    _getSocksProxyMap() {
        if (this._socksProxyCahce) {
            return this._socksProxyCahce;
        }
        this._socksProxyCahce = this._parseIp(this.configure.socksProxy);
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
