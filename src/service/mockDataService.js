const EventEmitter = require("events");
const _ = require("lodash");
const path = require("path");
const fileUtil = require("../utils/file");

/**
 * 数据mock
 */
module.exports = class MockDataService extends EventEmitter {
  constructor({appInfoService}) {
    super();
    this.appInfoService = appInfoService;

    let proxyDataDir = this.appInfoService.getProxyDataDir();

    // 存放mock data的目录
    this.mockDataDir = path.join(proxyDataDir, "mock-data");
    this.mockListDir = path.join(proxyDataDir, "mock-list");
    // userId -> datalist
    this.mockDataList = {};
  }

  async start() {
    // 加载用户的mock entry
    let contentMap = await fileUtil.getJsonFileContentInDir(this.mockListDir);
    _.forEach(contentMap, (content, fileName) => {
      let userId = fileName.slice(0, -5);
      this.mockDataList[userId] = content;
    });
  }

  /**
   * 获取数据文件内容
   * @param clientIp
   * @param dataId
   */
  async getDataFileContent(userId, dataId) {
    let dataFilePath = this._getDataFilePath(userId, dataId);
    try {
      return await fileUtil.readFile(dataFilePath);
    } catch (e) {
      return "";
    }
  }

  /**
   * 获取数据文件的 content type
   * {id:'',contenttype:'',name:''}
   * @returns {*}
   */
  async getDataFileContentType(userId, dataId) {
    let list = this.mockDataList[userId];
    // 寻找
    let finded = _.find(list, entry => {
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
  getMockDataList(userId) {
    return this.mockDataList[userId] || [];
  }

  async setMockDataList(userId, mocklist) {
    this.mockDataList[userId] = mocklist;
    let listFilePath = this._getMockEntryPath(userId);
    await fileUtil.writeJsonToFile(listFilePath, mocklist);
    // 发送消息通知
    this.emit('data-change', userId, this.getMockDataList(userId));
  }

  /**
   * 保存数据文件列表，清除无用的数据文件
   */
  async createDataFile(userId, dataEntry) {
    // 找出要被被删除的数据文件, 老的数据文件里有，而新的没有

    let dataList = this.getMockDataList(userId);
    dataList.push(dataEntry);

    await this.setMockDataList(userId, dataList);
  }

  async removeDataFile(userId, rmDataEntry) {
    // 找出要被被删除的数据文件, 老的数据文件里有，而新的没有

    let dataList = this.getMockDataList(userId);
    try {
      let dataPath = this._getDataFilePath(userId, rmDataEntry.id);
      await fileUtil.deleteFile(dataPath);
    } catch (e) {
    }

    dataList = dataList.filter(dataEntry => {
      return rmDataEntry.id != dataEntry.id;
    });

    await this.setMockDataList(userId, dataList);
  }

  /**
   * 用户保存数据文件
   * @param userId
   * @param dataFileId
   * @param content
   */
  async saveDataFileContent(userId, dataFileId, content) {
    let dataFilePath = this._getDataFilePath(userId, dataFileId);
    await fileUtil.writeFile(dataFilePath, content);
  }

  /**
   * 获取数据文件路径
   * @param userId
   * @param dataId
   * @private
   */
  _getDataFilePath(userId, dataId) {
    return path.join(this.mockDataDir, userId + "_" + dataId);
  }

  /**
   * 获取数据文件列表
   * @param userId
   * @private
   */
  _getMockEntryPath(userId) {
    return path.join(this.mockListDir, userId + ".json");
  }
};
