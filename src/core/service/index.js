/**
 * 服务注册
 * 应用启动的时候首先创建服务，然后注册到ServiceRegistry
 * 业务处理时需要使用服务时从ServiceRegistry取服务
 * @type {ServiceRegistry}
 */
let registry ;
module.exports = class ServiceRegistry {
    static registeServices(services) {
        registry = services;
    }

    static getBreakpointService() {

    }

    static getProfileService() {

    }

    static getConfigureService() {

    }

    static getHostService() {

    }

    static getHttpTrafficService() {

    }

    static getMockDataService() {

    }

    static getRuleService() {

    }

    static getFilterService() {

    }

    static getUserService() {

    }

    static getWsMockService() {

    }

    static getLogService() {

    }

    static getCertificationService() {

    }

    static getAppInfoService() {

    }
}