/**
 * 代理运转需要的规则数据
 * 代理端口、超时时间、gitlab token、工程路径、是否启用转发规则
 * Created by tsxuehu on 8/3/17.
 */
export default class ConfigureRepository {


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
    getEnableRuleByClientIp(clientIp) {

    }

    /**
     * 获取工程路径配置
     * @param clientIp
     */
    getProjectPathByClientIp(clientIp) {

    }

    /**
     * 代理超时时间
     * @param clientIp
     * @returns {number}
     */
    getRequestTimeoutTime(clientIp) {
        return 10000;
    }
}