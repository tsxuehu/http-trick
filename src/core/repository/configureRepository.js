import EventEmitter from "events";
import _ from "lodash";
/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
export default class ConfigureRepository extends EventEmitter {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
        this.defaultConf = {
            "projectPath": {
                "project name": "path to your project"
            },
            "proxyPort": 8001,
            "requestTimeoutTime": 10000,
            "gitlabToken": "",
            "enableRule": true
        };
        this.userConfMap = {};
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
     * 保存用户的配置
     * @param userId
     * @param config
     */
    setConfigByUserId(userId, config) {

    }

    /**
     * 获取用户的配置
     * @param userId
     */
    getConfigByUserId(userId) {

    }

    /**
     * 获取端口号
     */
    getProxyPort() {
    }

    /**
     * 获取gitlab token
     * @param userId
     */
    getGitlabTokenByUserId(userId) {

    }

    /**
     *
     * @param userId
     * @param enable
     */
    setEnableRuleByUserId(userId, enable) {

    }

    /**
     * 获取转发规则启用开关
     * @param clientIp
     */
    getEnableRule(clientIp) {

    }

    enableRule(userId) {

    }

    disableRule(userId) {

    }

    /**
     * 获取工程路径配置
     * @param clientIp
     */
    getProjectPath(clientIp) {

    }

    /**
     * 代理超时时间
     * @param clientIp
     * @returns {number}
     */
    getRequestTimeoutTime() {
        return 10000;
    }
}