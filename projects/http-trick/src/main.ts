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
import ProfileService from "service/manage/ProfileService";
import FilterService from "service/manage/FilterService";
import {RuleService} from "service/manage/RuleService";
import MockDataService from "service/manage/MockDataService";
import ConfigureService from "service/manage/ConfigureService";
import CertificationService from "service/manage/CertificationService";

async function main() {
    initAsyncContext();
    configureLogger();
    registerGlobalExceptionHandler();

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
    setContainer(container);
    // 初始化服务
    const configureService = await container.getServiceInstance<ConfigureService>(ConfigureService);
    const appInfo = await container.getServiceInstance<AppInfoService>(AppInfoService);
    const profileService = await container.getServiceInstance<ProfileService>(ProfileService);
    const hostService = await container.getServiceInstance<HostService>(HostService);
    const filterService = await container.getServiceInstance<FilterService>(FilterService);
    const ruleService = await container.getServiceInstance<RuleService>(RuleService);
    const mockDataService = await container.getServiceInstance<MockDataService>(MockDataService);
    const certificationService = await container.getServiceInstance<CertificationService>(CertificationService);
    // ========================================================================================
    await configureService.start();
    await appInfo.start();
    await profileService.start();
    await hostService.start();
    await filterService.start();
    await ruleService.start();
    await mockDataService.start();
    await certificationService.start();
}

main()
