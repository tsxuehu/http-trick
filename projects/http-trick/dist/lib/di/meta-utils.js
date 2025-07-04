"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.StartDependencyRegistry = exports.ControllerInfoRegistry = exports.DiServiceInfoRegistry = exports.DI_START_DEPENDENCY = exports.DependencyType = void 0;
exports.setServiceInfo = setServiceInfo;
exports.getServiceInfo = getServiceInfo;
exports.setServiceDependencyByName = setServiceDependencyByName;
exports.setServiceDependencyByFun = setServiceDependencyByFun;
exports.getDependencyList = getDependencyList;
exports.setServicePreStartDependencyByNames = setServicePreStartDependencyByNames;
exports.setServicePreStartDependencyByFun = setServicePreStartDependencyByFun;
exports.getServicePreStartInfo = getServicePreStartInfo;
exports.setControllerInfo = setControllerInfo;
exports.getControllerServiceNameList = getControllerServiceNameList;
exports.setRouterInfo = setRouterInfo;
exports.getRouterInfo = getRouterInfo;
const tslib_1 = require("tslib");
const camelCase_1 = tslib_1.__importDefault(require("lodash/camelCase"));
var DependencyType;
(function (DependencyType) {
    DependencyType["Name"] = "name";
    DependencyType["fun"] = "fun";
})(DependencyType || (exports.DependencyType = DependencyType = {}));
exports.DI_START_DEPENDENCY = '$di$start$dependency';
exports.DiServiceInfoRegistry = {};
exports.ControllerInfoRegistry = {};
exports.StartDependencyRegistry = {};
function setServiceInfo(clazz, name) {
    let serviceName = name || (0, camelCase_1.default)(clazz.name);
    let serviceInfo = exports.DiServiceInfoRegistry[clazz.name] || { dependencyList: [] };
    if (typeof serviceInfo.serviceName !== 'undefined') {
        throw new Error(`服务被重复设置 class: ${clazz.name} origin: ${serviceInfo.serviceName} new: ${serviceName}`);
    }
    serviceInfo.serviceName = serviceName;
    exports.DiServiceInfoRegistry[clazz.name] = serviceInfo;
}
function getServiceInfo(clazz) {
    return exports.DiServiceInfoRegistry[clazz.name] || null;
}
function setServiceDependencyByName(clazz, propertyName, serviceName) {
    let serviceInfo = exports.DiServiceInfoRegistry[clazz.name] || { dependencyList: [] };
    serviceInfo.dependencyList.push({
        propertyName,
        type: DependencyType.Name,
        name: serviceName
    });
    exports.DiServiceInfoRegistry[clazz.name] = serviceInfo;
}
function setServiceDependencyByFun(clazz, propertyName, fun) {
    let serviceInfo = exports.DiServiceInfoRegistry[clazz.name] || { dependencyList: [] };
    serviceInfo.dependencyList.push({
        propertyName,
        type: DependencyType.fun,
        fun
    });
    exports.DiServiceInfoRegistry[clazz.name] = serviceInfo;
}
function getDependencyList(clazz) {
    let serviceInfo = exports.DiServiceInfoRegistry[clazz.name];
    return serviceInfo?.dependencyList || [];
}
function setServicePreStartDependencyByNames(clazz, startFunctionName, dependencyList) {
    const startDependency = {
        functionName: startFunctionName,
        type: DependencyType.Name,
        names: dependencyList
    };
    clazz[exports.DI_START_DEPENDENCY] = startDependency;
}
function setServicePreStartDependencyByFun(clazz, startFunctionName, fun) {
    const startDependency = {
        functionName: startFunctionName,
        type: DependencyType.fun,
        fun
    };
    clazz[exports.DI_START_DEPENDENCY] = startDependency;
}
function getServicePreStartInfo(clazz) {
    return clazz[exports.DI_START_DEPENDENCY] || null;
}
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["HEAD"] = "head";
    HttpMethod["OPTIONS"] = "options";
    HttpMethod["GET"] = "get";
    HttpMethod["PUT"] = "put";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["POST"] = "post";
    HttpMethod["DELETE"] = "delete";
    HttpMethod["ALL"] = "all";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
const ControllerServiceRegistry = [];
function setControllerInfo(clazz, path) {
    let serviceName = `controller_${(0, camelCase_1.default)(clazz.name)}`;
    let routerInfo = exports.ControllerInfoRegistry[serviceName] || { requestMapList: [] };
    routerInfo.path = path;
    exports.ControllerInfoRegistry[serviceName] = routerInfo;
    let serviceInfo = exports.DiServiceInfoRegistry[clazz.name] || { dependencyList: [] };
    serviceInfo.serviceName = serviceName;
    exports.DiServiceInfoRegistry[clazz.name] = serviceInfo;
}
function getControllerServiceNameList() {
    return Object.keys(exports.ControllerInfoRegistry);
}
function setRouterInfo(clazz, functionName, method, path) {
    let serviceName = `controller_${(0, camelCase_1.default)(clazz.name)}`;
    let routerInfo = exports.ControllerInfoRegistry[serviceName] || { requestMapList: [] };
    routerInfo.requestMapList.push({
        functionName,
        method,
        path
    });
    exports.ControllerInfoRegistry[serviceName] = routerInfo;
}
function getRouterInfo(clazz) {
    let serviceName = `controller_${(0, camelCase_1.default)(clazz.name)}`;
    return exports.ControllerInfoRegistry[serviceName];
}
//# sourceMappingURL=meta-utils.js.map