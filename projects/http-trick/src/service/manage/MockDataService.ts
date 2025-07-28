import {Resource, Service} from "@spring4js/container-node";
import FileService from "service/infra/FileService";
import AppInfoService from "service/AppInfoService";
import path from "path";
import forEach from "lodash/forEach";
import find from "lodash/find";
import filter from "lodash/filter";
import {IMockItem} from "service/manage/mock-data";
import EventEmitter from "events";

@Service()
export default class MockDataService extends EventEmitter {
    @Resource() private fileService: FileService
    @Resource() private appInfoService: AppInfoService

    private mockDataDir: string
    private mockListDir: string
    private mockDataList: Record<string, IMockItem[]> = {} // userId -> datalist

    async start() {
        const dataDir = this.appInfoService.getProxyDataDir();
        this.mockDataDir = path.resolve(dataDir, "mock-data");
        this.mockListDir = path.resolve(dataDir, "mock-list");

        // 加载用户的mock entry
        let contentMap = await this.fileService.getJsonFileContentInDir<IMockItem[]>(this.mockListDir);
        forEach(contentMap, (content, fileName) => {
            let userId = fileName.slice(0, -5);
            this.mockDataList[userId] = content;
        });
    }

    async getDataFileContent(userId: string, dataId: string): Promise<string> {
        let dataFilePath = this._getDataFilePath(userId, dataId);
        try {
            return await this.fileService.readFile(dataFilePath);
        } catch (e) {
            return "";
        }
    }

    /**
     * 获取数据文件的 content type
     * {id:'',contenttype:'',name:''}
     */
    getDataFileContentType(userId: string, dataId: string) {
        let list = this.mockDataList[userId];
        // 寻找
        let finded = find(list, entry => {
            return entry.id == dataId;
        });
        if (!finded) return '';
        return finded.contenttype + ';charset=utf-8';
    }

    /**
     * 获取某个用户的数据列表
     * @param userId
     * @returns {*}
     */
    getMockDataList(userId: string): IMockItem[] {
        return this.mockDataList[userId] || [];
    }

    async setMockDataList(userId: string, mocklist: IMockItem[]) {
        this.mockDataList[userId] = mocklist;
        let listFilePath = this._getMockEntryPath(userId);
        await this.fileService.writeJsonToFile(listFilePath, mocklist);
        // 发送消息通知
        this.emit('data-change', userId, this.getMockDataList(userId));
    }

    async createDataFile(userId: string, dataEntry: IMockItem): Promise<void> {
        // 找出要被被删除的数据文件, 老的数据文件里有，而新的没有

        let dataList = this.getMockDataList(userId);
        dataList.push(dataEntry);

        await this.setMockDataList(userId, dataList);
    }

    async removeDataFile(userId: string, rmDataEntry: IMockItem): Promise<void> {
        // 找出要被被删除的数据文件, 老的数据文件里有，而新的没有

        let dataList = this.getMockDataList(userId);
        try {
            let dataPath = this._getDataFilePath(userId, rmDataEntry.id);
            await this.fileService.deleteFile(dataPath);
        } catch (e) {
        }

        dataList = dataList.filter(dataEntry => {
            return rmDataEntry.id != dataEntry.id;
        });

        await this.setMockDataList(userId, dataList);
    }

    async saveDataFileContent(userId: string, dataFileId: string, content: string) {
        let dataFilePath = this._getDataFilePath(userId, dataFileId);
        await this.fileService.writeFile(dataFilePath, content);
    }

    _getDataFilePath(userId: string, dataId: string): string {
        return path.join(this.mockDataDir, userId + "_" + dataId);
    }

    _getMockEntryPath(userId: string): string {
        return path.join(this.mockListDir, userId + ".json");
    }
}
