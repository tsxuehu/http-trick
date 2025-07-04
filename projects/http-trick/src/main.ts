import './module-hack'
import 'reflect-metadata'
import {configureLogger} from "config/log4js";
import {initAsyncContext} from "utils/trace";
import {registerGlobalExceptionHandler} from "./global-exception";
import path from "path";
import {Container} from "di/container";
import {setContainer} from "utils/global-var";
import glob from 'fast-glob';
import AppInfoService from "service/AppInfoService";
import HostService from "service/manage/HostService";

async function main() {
    initAsyncContext()
    configureLogger()
    registerGlobalExceptionHandler()

    // 初始化容器
    const container = new Container();
    const dirList = [
        path.resolve(__dirname, 'controller'),
        path.resolve(__dirname, 'service'),
    ];
    for (const dir of dirList) {
        const jsFileList: string[] = await glob(['**/*.js'], {
            cwd: dir,
        });
        for (const jsFile of jsFileList) {
            const obj: any = require(path.join(dir, jsFile));
            // @ts-ignore
            if (!isObject(obj) || !isObject(obj.default)) {
                continue;
            }
            // @ts-ignore
            const clazz = <IServiceClazz>obj.default;
            clazz.jsFile = jsFile;
            container.registerServiceClazz(clazz);
        }
    }

    // 挂载到全局
    setContainer(container)
    // 初始化服务
    const appInfo = await container.getServiceInstance<AppInfoService>(AppInfoService)
    const hostService = await container.getServiceInstance<HostService>(HostService)
    await appInfo.start()
    await hostService.start()
}

main()
