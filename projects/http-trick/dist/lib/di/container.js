"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tslib_1 = require("tslib");
const isFunction_1 = tslib_1.__importDefault(require("lodash/isFunction"));
const isObject_1 = tslib_1.__importDefault(require("lodash/isObject"));
const graph_1 = require("./graph");
const meta_utils_1 = require("./meta-utils");
class Container {
    constructor({ serviceNotFoundHandle } = {}) {
        this.clazzMap = new Map();
        this.instanceMap = new Map();
        this.serviceNotFoundHandle = serviceNotFoundHandle;
    }
    registerServiceClazz(clazz) {
        let serviceInfo = (0, meta_utils_1.getServiceInfo)(clazz);
        if (!(0, isObject_1.default)(serviceInfo)) {
            return;
        }
        if (serviceInfo.serviceName) {
            if (this.hasServiceClazz(serviceInfo.serviceName)) {
                let origin = this.getServiceClazz(serviceInfo.serviceName);
                throw new Error(`服务名 ${serviceInfo.serviceName} 被重复注册。\t${clazz.jsFile}\t${origin.jsFile}`);
            }
            else {
                this.setServiceClazz(serviceInfo.serviceName, clazz);
            }
        }
    }
    getServiceInstanceSync(serviceName) {
        let instance = this.instanceMap.get(serviceName);
        if (!instance) {
            throw new Error(`服务不存在：${serviceName}`);
        }
        return instance;
    }
    async getServiceInstance(serviceName) {
        let has = this.hasServiceClazz(serviceName);
        if (!has && this.serviceNotFoundHandle) {
            let result = await this.serviceNotFoundHandle(serviceName);
            return result;
        }
        else {
        }
        let instance = this.instanceMap.get(serviceName);
        if (!instance) {
            instance = await this.createServiceInstance(serviceName);
        }
        return instance;
    }
    getRouterInfo() {
        let routerList = [];
        let serviceNameList = (0, meta_utils_1.getControllerServiceNameList)();
        for (let serviceName of serviceNameList) {
            let clazz = this.getServiceClazz(serviceName);
            let routerInfo = (0, meta_utils_1.getRouterInfo)(clazz);
            for (let requestMap of routerInfo.requestMapList) {
                let requestPath;
                if (requestMap.path.startsWith('/')) {
                    requestPath = requestMap.path;
                }
                else {
                    requestPath = routerInfo.path + (routerInfo.path.endsWith('/') ? requestMap.path : '/' + requestMap.path);
                }
                routerList.push({
                    httpMethod: requestMap.method,
                    requestPath,
                    serviceName,
                    functionName: requestMap.functionName
                });
            }
        }
        return routerList;
    }
    async createServiceInstance(serviceName) {
        if (this.hasServiceInstance(serviceName)) {
            return this.instanceMap.get(serviceName);
        }
        const graph = new graph_1.Graph();
        let dependencyCount = 0;
        const stack = [serviceName];
        let needInstancedServiceSet = new Set();
        while (stack.length > 0) {
            if (dependencyCount++ > 200) {
                throw new Error(`${serviceName}依赖过多`);
            }
            const currentServiceName = stack.pop();
            if (needInstancedServiceSet.has(currentServiceName)) {
                continue;
            }
            else {
                needInstancedServiceSet.add(currentServiceName);
            }
            let clazz = this.getServiceClazz(currentServiceName);
            if (!clazz) {
                throw new Error(`服务[${currentServiceName}]不存在`);
            }
            const needInstancedDependencyList = new Set();
            for (let dependencyInfo of (0, meta_utils_1.getDependencyList)(clazz)) {
                let diServiceName;
                if (dependencyInfo.type === meta_utils_1.DependencyType.Name) {
                    diServiceName = dependencyInfo.name;
                }
                else {
                    diServiceName = dependencyInfo.fun();
                }
                if (this.hasServiceInstance(diServiceName) || needInstancedServiceSet.has(diServiceName)) {
                    continue;
                }
                else {
                    stack.push(diServiceName);
                    needInstancedDependencyList.add(diServiceName);
                }
                dependencyCount++;
            }
            graph.lookupOrInsertNode(currentServiceName);
            const preStartInfo = (0, meta_utils_1.getServicePreStartInfo)(clazz);
            if (preStartInfo != null) {
                let names;
                if (preStartInfo.type === meta_utils_1.DependencyType.Name) {
                    names = preStartInfo.names;
                }
                else {
                    names = preStartInfo.fun();
                }
                for (const diServiceName of names) {
                    if (needInstancedDependencyList.has(diServiceName)) {
                        graph.insertEdge(currentServiceName, diServiceName);
                    }
                }
            }
        }
        const instanceCache = new Map();
        for (const needInitializedServiceName of needInstancedServiceSet) {
            let clazz = this.getServiceClazz(needInitializedServiceName);
            let instance = new clazz();
            instanceCache.set(needInitializedServiceName, instance);
        }
        for (const needInitializedServiceName of needInstancedServiceSet) {
            const clazz = this.getServiceClazz(needInitializedServiceName);
            const currentInstance = instanceCache.get(needInitializedServiceName);
            for (let dependencyInfo of (0, meta_utils_1.getDependencyList)(clazz)) {
                const propertyName = dependencyInfo.propertyName;
                const diServiceName = dependencyInfo.type === meta_utils_1.DependencyType.Name ? dependencyInfo.name : dependencyInfo.fun();
                if (instanceCache.has(diServiceName)) {
                    currentInstance[propertyName] = instanceCache.get(diServiceName);
                }
                else {
                    currentInstance[propertyName] = await this.getServiceInstance(diServiceName);
                }
            }
        }
        while (true) {
            const leafList = graph.getLeafList();
            if (leafList.length == 0) {
                if (!graph.isEmpty()) {
                    throw new Error(`${serviceName}存在循环依赖\n${graph.toString()}`);
                }
                break;
            }
            for (const currentLeafServiceName of leafList) {
                const clazz = this.getServiceClazz(currentLeafServiceName);
                const preStartInfo = (0, meta_utils_1.getServicePreStartInfo)(clazz);
                const instance = instanceCache.get(currentLeafServiceName);
                if (preStartInfo != null) {
                    if ((0, isFunction_1.default)(instance[preStartInfo.functionName])) {
                        await instance[preStartInfo.functionName]();
                    }
                }
                graph.removeNode(currentLeafServiceName);
            }
        }
        for (const [sn, instance] of instanceCache.entries()) {
            this.setServiceInstance(sn, instance);
        }
        return instanceCache.get(serviceName);
    }
    setServiceInstance(serviceName, instance) {
        this.instanceMap.set(serviceName, instance);
    }
    hasServiceInstance(serviceName) {
        return this.instanceMap.has(serviceName);
    }
    getServiceClazz(serviceName) {
        return this.clazzMap.get(serviceName);
    }
    hasServiceClazz(serviceName) {
        return this.clazzMap.has(serviceName);
    }
    setServiceClazz(serviceName, clazz) {
        this.clazzMap.set(serviceName, clazz);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map