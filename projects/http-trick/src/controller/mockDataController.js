/**
 * Created by tsxuehu on 4/11/17.
 */

const ServiceRegistry = require("../../../service");
/**
 * 数据文件相关api
 */
let instance;
module.exports = class MockDataController {
  static getInstance() {
    if (!instance) {
      instance = new MockDataController();
    }
    return instance;
  }

  constructor() {
    this.mockDataService = ServiceRegistry.getMockDataService();
    this.httpTrafficService = ServiceRegistry.getHttpTrafficService();
  }

  regist(router) {

    // 获取mock数据列表
    router.get('/data/getdatalist', async (ctx, next) => {
      let userId = ctx.userId;
      let dataList = await this.mockDataService.getMockDataList(userId);
      ctx.body = {
        code: 0,
        data: dataList
      };
    });
    // 保存数据列表
    router.post('/data/removedatafile', (ctx, next) => {
      let userId = ctx.userId;
      this.mockDataService.removeDataFile(userId, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });

    router.post('/data/createdatafile', (ctx, next) => {
      let userId = ctx.userId;
      this.mockDataService.createDataFile(userId, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });


    // 读取数据文件
    router.get('/data/getdatafile', async (ctx, next) => {
      let userId = ctx.userId;
      let content = await this.mockDataService.getDataFileContent(userId, ctx.query.id);
      ctx.body = {
        code: 0,
        data: content
      };
    });
    // 保存数据文件
    router.post('/data/savedatafile', (ctx, next) => {
      let userId = ctx.userId;
      this.mockDataService.saveDataFileContent(userId, ctx.query.id, ctx.request.body.fields.content);
      ctx.body = {
        code: 0
      };
    });
    // 从http请求日志中保存 mock 数据
    router.post('/data/savedatafromtraffic', async (ctx, next) => {
      let userId = ctx.userId;
      let {id, name, contenttype} = ctx.request.body;
      let content = await this.httpTrafficService.getResponseBody(userId, ctx.request.body.reqid);
      let entry = {
        id: id,
        name: name,
        contenttype: contenttype
      };
      await this.mockDataService.createDataFile(userId, entry);
      await this.mockDataService.saveDataFileContent(userId, id, content);

      ctx.body = {
        code: 0
      };
    });
  }
}
