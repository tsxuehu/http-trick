import {Resource, Service} from "di/annotation";
import FileService from "service/infra/FileService";
import AppInfoService from "service/AppInfoService";
import {IHostFile} from "service/manage/host";
import {IUserProfile} from "service/manage/profile";

@Service()
export default class HostService {
    @Resource() private fileService: FileService
    @Resource() private appInfoService: AppInfoService

    private userHostFilesMap: Record<string, IUserProfile> = {}

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir()
        await this.fileService.makeDir(AppInfoService.getProxyDataDir())
    }
}
