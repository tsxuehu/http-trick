/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
export default class ConfigureRepository {
    constructor() {
        this.defaultConf = {};
    }

    getConf() {

    }

    setConf(userId, conf) {

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
                var matchList = href.match(new RegExp(match));
                _.forEach(matchList, function (value, index) {
                    if (index == 0) return;
                    var reg = new RegExp('\\$' + index, 'g');
                    target = target.replace(reg, value);
                });
                // 解析应用的变量
                return dc.resolvePath(target);
            } catch (e) {
            }
        }
    }

    calcPathbyClientIp(clientIp, href, match, target) {

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