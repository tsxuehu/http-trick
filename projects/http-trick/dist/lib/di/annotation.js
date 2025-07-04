"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = Service;
exports.Resource = Resource;
exports.createLazyResource = createLazyResource;
exports.PreStart = PreStart;
exports.Controller = Controller;
exports.Path = Path;
const meta_utils_1 = require("./meta-utils");
function Service({ name } = { name: '' }) {
    return (target, key, descriptor) => {
        (0, meta_utils_1.setServiceInfo)(target, name);
    };
}
function Resource({ name } = { name: '' }) {
    return (target, key, descriptor) => {
        let propertyName = key;
        let serviceName = name || propertyName;
        (0, meta_utils_1.setServiceDependencyByName)(target.constructor, propertyName, serviceName);
    };
}
function createLazyResource(getContainer) {
    return ({ name } = { name: '' }) => {
        return (target, propertyKey) => {
            const descriptor = {
                get: function () {
                    let serviceName = name;
                    if (!serviceName) {
                        const serviceClazz = Reflect.getMetadata('design:type', target, propertyKey);
                        if (!serviceClazz) {
                            throw new Error(`找不到元数据，存在循环引用。需要在inject参数中指定服务名. ${target.constructor.name} ${propertyKey}`);
                        }
                        serviceName = (0, meta_utils_1.getServiceInfo)(serviceClazz).serviceName;
                    }
                    const service = getContainer().getServiceInstanceSync(serviceName);
                    let isSuccess = Reflect.deleteProperty(target, propertyKey);
                    isSuccess = isSuccess && Reflect.set(target, propertyKey, service);
                    if (!isSuccess) {
                        throw new Error(`服务实例注入失败. ${target.constructor.name} ${propertyKey}`);
                    }
                    return service;
                }
            };
            return descriptor;
        };
    };
}
function PreStart(serviceNames = []) {
    return (target, key, descriptor) => {
        (0, meta_utils_1.setServicePreStartDependencyByNames)(target.constructor, key, serviceNames);
    };
}
function Controller(path = '') {
    return (target, key, descriptor) => {
        (0, meta_utils_1.setControllerInfo)(target, path);
    };
}
function Path(path, method) {
    return (target, functionName, descriptor) => {
        (0, meta_utils_1.setRouterInfo)(target.constructor, functionName, method, path);
    };
}
//# sourceMappingURL=annotation.js.map