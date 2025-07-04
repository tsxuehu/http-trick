import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'

import {Graph} from './graph'
import {
    DependencyType,
    getControllerServiceNameList,
    getDependencyList,
    getRouterInfo,
    getServiceInfo,
    getServicePreStartInfo,
    HttpMethod,
    RouterInfo
} from './meta-utils'

export interface IServiceClazz {
    new(): any

    jsFile?: string
}

export interface ServiceNotFoundHandle {
    (serviceName: string): Promise<any>
}

export interface Router {
    httpMethod: HttpMethod
    requestPath: string
    serviceName: string
    functionName: string
}

export class Container {
    private clazzMap = new Map<string, IServiceClazz>()
    private instanceMap = new Map<string, any>()
    private serviceNotFoundHandle?: ServiceNotFoundHandle

    constructor({
                    serviceNotFoundHandle
                }: {
        serviceNotFoundHandle?: ServiceNotFoundHandle
    } = {}) {
        this.serviceNotFoundHandle = serviceNotFoundHandle
    }

    // 注册服务
    registerServiceClazz(clazz: IServiceClazz) {
        let serviceInfo = getServiceInfo(clazz)
        if (!isObject(serviceInfo)) {
            return
        }

        if (serviceInfo.serviceName) {
            if (this.hasServiceClazz(serviceInfo.serviceName)) {
                let origin = this.getServiceClazz(serviceInfo.serviceName)
                throw new Error(`服务名 ${serviceInfo.serviceName} 被重复注册。\t${clazz.jsFile}\t${origin.jsFile}`)
            } else {
                this.setServiceClazz(serviceInfo.serviceName, clazz)
            }
        }
    }

    getServiceInstanceSync<T>(serviceIdentifier: (new () => T) | string): T {
        let serviceName: string
        if (typeof serviceIdentifier !== 'string') {
            serviceName = getServiceInfo(serviceIdentifier).serviceName
        } else {
            serviceName = serviceIdentifier as string
        }
        let instance = this.instanceMap.get(serviceName)
        if (!instance) {
            throw new Error(`服务不存在：${serviceName}`)
        }
        return instance
    }

    async getServiceInstance<T>(serviceIdentifier: (new () => T) | string): Promise<T> {
        let serviceName: string
        if (typeof serviceIdentifier !== 'string') {
            serviceName = getServiceInfo(serviceIdentifier).serviceName
        } else {
            serviceName = serviceIdentifier as string
        }
        let has = this.hasServiceClazz(serviceName)
        if (!has && this.serviceNotFoundHandle) {
            return await this.serviceNotFoundHandle(serviceName)
        }
        let instance = this.instanceMap.get(serviceName)
        if (!instance) {
            instance = await this.createServiceInstance(serviceName)
        }
        return instance
    }

    getRouterInfo(): Router[] {
        let routerList: Router[] = []
        let serviceNameList = getControllerServiceNameList()
        for (let serviceName of serviceNameList) {
            let clazz = this.getServiceClazz(serviceName)
            let routerInfo: RouterInfo = getRouterInfo(clazz)
            for (let requestMap of routerInfo.requestMapList) {
                let requestPath
                if (requestMap.path.startsWith('/')) {
                    requestPath = requestMap.path
                } else {
                    requestPath = routerInfo.path + (routerInfo.path.endsWith('/') ? requestMap.path : '/' + requestMap.path)
                }
                routerList.push({
                    httpMethod: requestMap.method,
                    requestPath,
                    serviceName,
                    functionName: requestMap.functionName
                })
            }
        }
        return routerList
    }

    /**
     * 创建服务
     * @param serviceName
     */
    private async createServiceInstance(serviceName: string): Promise<any> {
        // serviceName如果已经初始化直接返回
        if (this.hasServiceInstance(serviceName)) {
            return this.instanceMap.get(serviceName)
        }

        // 1. 找出所有未创建实例的依赖, 并构造初始化依赖图
        const graph = new Graph()
        let dependencyCount = 0
        const stack = [serviceName]
        let needInstancedServiceSet = new Set<string>()
        while (stack.length > 0) {
            if (dependencyCount++ > 200) {
                throw new Error(`${serviceName}依赖过多`)
            }
            const currentServiceName = stack.pop()!
            if (needInstancedServiceSet.has(currentServiceName)) {
                continue
            } else {
                needInstancedServiceSet.add(currentServiceName)
            }

            let clazz = this.getServiceClazz(currentServiceName)
            if (!clazz) {
                throw new Error(`服务[${currentServiceName}]不存在`)
            }
            const needInstancedDependencyList = new Set()
            for (let dependencyInfo of getDependencyList(clazz)) {
                let diServiceName: string
                if (dependencyInfo.type === DependencyType.Name) {
                    diServiceName = dependencyInfo.name!
                } else {
                    diServiceName = dependencyInfo.fun!()
                }
                if (this.hasServiceInstance(diServiceName) || needInstancedServiceSet.has(diServiceName)) {
                    continue
                } else {
                    stack.push(diServiceName)
                    needInstancedDependencyList.add(diServiceName)
                }
                dependencyCount++
            }
            // 构造初始化依赖图
            graph.lookupOrInsertNode(currentServiceName)
            const preStartInfo = getServicePreStartInfo(clazz)
            if (preStartInfo != null) {
                let names: string[]
                if (preStartInfo.type === DependencyType.Name) {
                    names = preStartInfo.names!
                } else {
                    names = preStartInfo.fun!()
                }
                for (const diServiceName of names) {
                    if (needInstancedDependencyList.has(diServiceName)) {
                        graph.insertEdge(currentServiceName, diServiceName)
                    }
                }
            }
        }
        // 2. 创建实例
        const instanceCache = new Map()
        for (const needInitializedServiceName of needInstancedServiceSet) {
            let clazz = this.getServiceClazz(needInitializedServiceName)
            let instance = <any>new clazz()
            instanceCache.set(needInitializedServiceName, instance)
        }
        // 3. 组装依赖
        for (const needInitializedServiceName of needInstancedServiceSet) {
            const clazz = this.getServiceClazz(needInitializedServiceName)
            const currentInstance = instanceCache.get(needInitializedServiceName)
            for (let dependencyInfo of getDependencyList(clazz)) {
                const propertyName = dependencyInfo.propertyName
                const diServiceName = dependencyInfo.type === DependencyType.Name ? dependencyInfo.name : dependencyInfo.fun!()

                if (instanceCache.has(diServiceName)) {
                    currentInstance[propertyName] = instanceCache.get(diServiceName)
                } else {
                    currentInstance[propertyName] = await this.getServiceInstance(diServiceName!)
                }
            }
        }

        // 4. 执行初始化
        while (true) {
            const leafList = graph.getLeafList()
            if (leafList.length == 0) {
                if (!graph.isEmpty()) {
                    throw new Error(`${serviceName}存在循环依赖\n${graph.toString()}`)
                }
                break
            }
            for (const currentLeafServiceName of leafList) {
                const clazz = this.getServiceClazz(currentLeafServiceName)
                const preStartInfo = getServicePreStartInfo(clazz)
                const instance = instanceCache.get(currentLeafServiceName)
                if (preStartInfo != null) {
                    if (isFunction((<any>instance)[preStartInfo.functionName])) {
                        // TODO 启动时间过程 需要warning
                        await (<any>instance)[preStartInfo.functionName]() // 启动
                    }
                }
                // 删除节点
                graph.removeNode(currentLeafServiceName)
            }
        }
        // 5. 放缓存
        for (const [sn, instance] of instanceCache.entries()) {
            this.setServiceInstance(sn, instance)
        }
        // 返回实例
        return instanceCache.get(serviceName)
    }

    private setServiceInstance(serviceName: string, instance: any) {
        this.instanceMap.set(serviceName, instance)
    }

    private hasServiceInstance(serviceName: string): boolean {
        return this.instanceMap.has(serviceName)
    }

    private getServiceClazz(serviceName: string): IServiceClazz {
        return this.clazzMap.get(serviceName)!
    }

    hasServiceClazz(serviceName: string): boolean {
        return this.clazzMap.has(serviceName)
    }

    private setServiceClazz(serviceName: string, clazz: IServiceClazz) {
        this.clazzMap.set(serviceName, clazz)
    }
}
