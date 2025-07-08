import camelCase from 'lodash/camelCase'

export interface ServiceInfo {
    serviceName: string
    preStartInfo?: PreStartInfo
    dependencyList: PropertyDependency[]
}

export interface RouterInfo {
    path: string
    requestMapList: { path: string; method: HttpMethod; functionName: string }[]
}

export interface PreStartInfo {
    functionName: string
    type: DependencyType
    names?: string[]
    fun?: () => string[]
}

export interface PropertyDependency {
    propertyName: string
    type: DependencyType
    fun?: () => string
    name?: string
}

export enum DependencyType {
    Name = 'name',
    fun = 'fun'
}

export interface IService {
    start(): Promise<void>
}

export const DI_START_DEPENDENCY = '$di$start$dependency'

export const DiServiceInfoRegistry: Record<string, ServiceInfo> = {} // className -> ServiceInfo
export const ControllerInfoRegistry: Record<string, RouterInfo> = {} // serviceName -> RouterInfo
/**
 * 服务声明
 * {
 *     serviceName: 'name',
 *     dependencyList: [{
 *         'propertyName': '',
 *         'serviceName': ''
 *     }]
 * }
 */
export function setServiceInfo(clazz: any, name?: string) {
    let serviceName = name || camelCase(clazz.name)
    let serviceInfo: ServiceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}
    if (serviceInfo.serviceName) {
        throw new Error(`服务被重复设置 class: ${clazz.name} origin: ${serviceInfo.serviceName} new: ${serviceName}`)
    }
    serviceInfo.serviceName = serviceName
    DiServiceInfoRegistry[clazz.name] = serviceInfo
}

export function getServiceInfo(clazz: any): ServiceInfo {
    return DiServiceInfoRegistry[clazz.name] || null
}

/**
 * 依赖
 */
export function setServiceDependencyByName(clazz: any, propertyName: string, serviceName: string) {
    let serviceInfo: ServiceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}
    serviceInfo.dependencyList.push({
        propertyName,
        type: DependencyType.Name,
        name: serviceName
    })
    DiServiceInfoRegistry[clazz.name] = serviceInfo
}

export function setServiceDependencyByFun(clazz: any, propertyName: string, fun: () => string) {
    let serviceInfo: ServiceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}
    serviceInfo.dependencyList.push({
        propertyName,
        type: DependencyType.fun,
        fun
    })
    DiServiceInfoRegistry[clazz.name] = serviceInfo
}

export function getDependencyList(clazz: any): PropertyDependency[] {
    let serviceInfo = DiServiceInfoRegistry[clazz.name]
    return serviceInfo?.dependencyList || []
}

/**
 * 初始化
 */
export function setServicePreStartDependencyByNames(clazz: any, startFunctionName: string, dependencyList: string[]) {
    const serviceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}
    serviceInfo.preStartInfo = {
        functionName: startFunctionName,
        type: DependencyType.Name,
        names: dependencyList
    }
}

export function setServicePreStartDependencyByFun(clazz: any, startFunctionName: string, fun: () => string[]) {
    const serviceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}

    serviceInfo.preStartInfo = {
        functionName: startFunctionName,
        type: DependencyType.fun,
        fun
    }
}

export function getServicePreStartInfo(clazz: any): PreStartInfo | undefined {
    const serviceInfo = DiServiceInfoRegistry[clazz.name]
    return serviceInfo?.preStartInfo
}

/**
 * {
 *     path: ''
 *     method: [
 *         {
 *             path: '', // 路径
 *             method: '', // http方法
 *             handlerName: '' //函数名
 *         }
 *     ]
 * }
 *
 * @param name
 * @constructor
 */
export enum HttpMethod {
    HEAD = 'head',
    OPTIONS = 'options',
    GET = 'get',
    PUT = 'put',
    PATCH = 'patch',
    POST = 'post',
    DELETE = 'delete',
    ALL = 'all'
}

export function setControllerInfo(clazz: any, path: string) {
    let serviceName = `controller_${camelCase(clazz.name)}`

    let routerInfo: RouterInfo = ControllerInfoRegistry[serviceName] || {path: '', requestMapList: []}
    routerInfo.path = path
    ControllerInfoRegistry[serviceName] = routerInfo

    let serviceInfo = DiServiceInfoRegistry[clazz.name] || {serviceName: '', dependencyList: []}
    serviceInfo.serviceName = serviceName
    DiServiceInfoRegistry[clazz.name] = serviceInfo
}

export function getControllerServiceNameList(): string[] {
    return Object.keys(ControllerInfoRegistry)
}

export function setRouterInfo(clazz: any, functionName: string, method: HttpMethod, path: string) {
    let serviceName = `controller_${camelCase(clazz.name)}`
    let routerInfo: RouterInfo = ControllerInfoRegistry[serviceName] || {path: '', requestMapList: []}
    routerInfo.requestMapList.push({
        functionName,
        method,
        path
    })
    ControllerInfoRegistry[serviceName] = routerInfo
}

export function getRouterInfo(clazz: any): RouterInfo {
    let serviceName = `controller_${camelCase(clazz.name)}`
    return ControllerInfoRegistry[serviceName]
}
