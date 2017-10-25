const EventEmitter = require("events");
const _ = require("lodash");
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class ConfigureService extends EventEmitter {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
        this.defaultConf = {
            "projectPath": {
                "project name": "path to your project"
            },
            "enableRule": true
        };
        this.userConfMap = {};
    }

    start(){

    }

    getConf(userId) {
        return this.userConfMap[userId];
    }

    setConf(userId, conf) {
        this.userConfMap[userId] = conf;
        // 发送通知
        this.emit('data-change', userId, conf)
    }

    /**
     * 替换redirect中的变量引用,
     * 如果引用的变量不存在，则不做替换
     * @param clientIp
     * @param href
     * @param match
     * @param target
     */
    calcPathbyUser(userId, href, match, target) {
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
                let projectPath = this.getConf(userId).projectPath;
                // 解析应用的变量
                return compiled(projectPath);
            } catch (e) {
            }
        }
    }

    calcPathbyClientIp(clientIp, href, match, target) {
        let userId = this.userRepository.getClientIpMappedUserId(clientIp);
        return this.calcPathbyUser(userId, href, match, target);
    }

    /**
     *
     * @param userId
     * @param enable
     */
    setEnableRule(userId, enable) {
        let conf = this.userConfMap[userId];
        conf.enableRule = enable;
        this.setConf(userId, this.userConfMap[userId]);
    }

    /**
     * 获取转发规则启用开关
     * @param clientIp
     */
    getEnableRule(clientIp) {
        return this.getConf(userId).enableRule;
    }

    getProxyPort(clientIp){
        let userId = this.userRepository.getClientIpMappedUserId(clientIp);
        return this.getConf(userId).proxyPort;
    }
}