import EventEmitter from "events";
import _ from "lodash";
import * as fileUtil from "../utils/file";

/**
 * Created by tsxuehu on 8/3/17.
 */
export default class MockDataRepository extends EventEmitter {
    constructor(userRepository, appInfoRepository) {
        super();
        this.userRepository = userRepository;
        this.appInfoRepository = appInfoRepository;
        let proxyDataDir = this.appInfoRepository.getProxyDataDir();
        this.mockDataDir = path.join(proxyDataDir, "mock-data");
        // userId -> datalist
        this.mockDataList = {};
    }

    async getDataContent(clientIp, dataId) {
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
        let dataFilePath = this._getDataFilePath(userId, dataId);
        return await fileUtil.readFile(dataFilePath);
    }


    /**
     * {id:'',contenttype:'',name:''}
     * @returns {*}
     */
    async getDataFileContentType(clientIp, dataId) {
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
        let list = this.mockDataList[userId];
        // 寻找
        let finded = _.find(list, entry => {
            return entry.id == dataId;
        });
        if (!finded) return '';
        return finded.contenttype + ';charset=utf-8';
    }

    getMockDataList(userId) {
        return this.mockDataList[userId];
    }
    // 保存数据文件列表，清除无用的数据文件
    saveMockDataList(userId, dataList) {
        // 找出被删除的数据文件
        store.dataList = content;
        file.writeJsonFile(dataListPath, content);
        file.readFileInDir(datafileDir, function (nameList) {
            var fileNameList = _.filter(nameList, function (name) {
                return name.length > 20;
            });
            var tobeDelete = fileNameList;
            var toBeAdded = [];
            _.forEach(store.dataList, function (entry) {
                var index = _.findIndex(tobeDelete, function (id) {
                    return id == entry.id;
                });
                // 如果找到则保留
                if (index > -1) {
                    tobeDelete.splice(index, 1);
                } else {
                    toBeAdded.push(entry.id);
                }
            });
            // 进行文件操作
            _.forEach(toBeAdded, function (id) {// 写空文件
                file.writeFileUTF8(path.join(datafileDir, id), '');
            });
            _.forEach(tobeDelete, function (id) {// 写空文件
                file.deleteFile(path.join(datafileDir, id));
            });
        })

    }

    saveDataFileContent(userId, dataFileId, content) {

    }

    getDataFileContent(userId, dataFileId) {

    }

    /**
     * 用户从监控窗保存一个数据文件
     */
    saveDataEntryFromTraffic(userId, dataFileId, fileName, contentType, reqId) {

    }

    _getDataFilePath(userId, dataId) {

    }

}