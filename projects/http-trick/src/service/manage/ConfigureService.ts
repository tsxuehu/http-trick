import {Resource, Service} from "di/annotation";
import forEach from "lodash/forEach";
import filter from "lodash/filter";
import assign from "lodash/assign";
import {DefaultConfigure, IConfigure} from "service/manage/configure";
import AppInfoService from "service/AppInfoService";
import FileService from "service/infra/FileService";
import path from "path";
import EventEmitter from "events";


@Service()
export default class ConfigureService extends EventEmitter {

    @Resource() private appInfoService: AppInfoService
    @Resource() private fileService: FileService

    private configureFile: string
    private configure: IConfigure

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.configureFile = path.resolve(dataDir, "configure.json");

        let customConfigure = await this.fileService.readJsonFromFile(this.configureFile);
        this.configure = assign({}, DefaultConfigure, customConfigure);
    }


    // 获取配置
    getConfigure() {
        return this.configure;
    }

    // 设置配置，保存到文件
    async setConfigure(userId: string, configure: IConfigure) {
        this.configure = configure;
        await this.fileService.writeJsonToFile(this.configureFile, this.configure);
        // 发送通知
        this.emit('data-change', userId, this.configure);
    }

    // 获取代理端口
    getRemoteDnsServer(): string {
        return this.configure.remoteDnsServer;
    }

    getRequestTimeout(): number {
        return this.configure.requestTimeoutTime;
    }

    useCustomRootCA(): boolean {
        return this.configure.useCustomRootCA;
    }
}
