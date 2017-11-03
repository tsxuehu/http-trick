const EventEmitter = require("events");
const _ = require("lodash");
const fileUtil = require("../../core/utils/file");
const path = require('path');

const defaultConfigure = {
    "gitlabToken": "",
    "proxyPort": 8001,
    "requestTimeoutTime": 10000
};
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ProfileService extends EventEmitter {
    constructor({appInfoService}) {
        super();
        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        this.configureFile = path.join(proxyDataDir, "configure.json");
        this.configure = {};
    }

    async start() {
        let customConfigure = await fileUtil.readJsonFromFile(this.configureFile);
        this.configure = _.assign({}, defaultConfigure, customConfigure);
    }

    getConfigure() {
        return this.configure;
    }

    setConfigure(configure) {
        this.configure = configure;
        fileUtil.writeJsonToFile(this.configureFile, this.configure);
        // 发送通知
        this.emit('data-change', this.configure)
    }

    getProxyPort() {
        return this.configure.proxyPort;
    }
}