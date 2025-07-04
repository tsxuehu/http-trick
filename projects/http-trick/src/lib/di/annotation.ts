import {
    HttpMethod,
    setControllerInfo,
    setServiceDependencyByName,
    setRouterInfo,
    setServiceInfo,
    setServicePreStartDependencyByNames, getServiceInfo
} from './meta-utils'
import {Container} from "./container";
/**
 * 服务声明注解
 * @param name
 * @constructor
 */
export function Service({name}: { name: string } = {name: ''}) {
    return (target: any, key?: string | symbol, descriptor?: any): void => {
        setServiceInfo(target, name)
    }
}

/**
 * 依赖声明注解
 * @param name
 * @constructor
 */
export function Resource({name} = {name: ''}) {
    return (target: any, key?: string, descriptor?: any): void => {
        let propertyName = key!
        let serviceName = name || propertyName
        setServiceDependencyByName(target.constructor, propertyName, serviceName)
    }
}

export function createLazyResource(getContainer: () => Container) {
    return ({name} = {name: ''}) => {
        return (target: any, propertyKey: string): any => {
            const descriptor: PropertyDescriptor = {
                get: function () {
                    let serviceName: string = name
                    if (!serviceName) {
                        const serviceClazz = Reflect.getMetadata('design:type', target, propertyKey)
                        if (!serviceClazz) {
                            throw new Error(`找不到元数据，存在循环引用。需要在inject参数中指定服务名. ${target.constructor.name} ${propertyKey}`)
                        }
                        serviceName = getServiceInfo(serviceClazz).serviceName!
                    }
                    const service = getContainer().getServiceInstanceSync(serviceName)
                    // 重设属性值 将服务实例注入
                    let isSuccess = Reflect.deleteProperty(target, propertyKey)
                    isSuccess = isSuccess && Reflect.set(target, propertyKey, service)
                    if (!isSuccess) {
                        throw new Error(`服务实例注入失败. ${target.constructor.name} ${propertyKey}`)
                    }

                    return service
                }
            }
            return descriptor
        }
    }
}

/**
 * 初始化, 记录服务初始化依赖
 */
export function PreStart(serviceNames: string[] = []) {
    // let serviceNames: string[]= Array.from(arguments);
    return (target: any, key: string, descriptor?: any): void => {
        setServicePreStartDependencyByNames(target.constructor, key, serviceNames)
    }
}

export function Controller(path = '') {
    return (target: any, key?: string | symbol, descriptor?: any): void => {
        setControllerInfo(target, path)
    }
}

export function Path(path: string, method: HttpMethod) {
    return (target: any, functionName: string, descriptor?: any): void => {
        setRouterInfo(target.constructor, functionName, method, path)
    }
}
