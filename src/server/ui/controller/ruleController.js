/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../../service");

let instance;
module.exports = class RuleController {
  static getInstance() {
    if (!instance) {
      instance = new RuleController();
    }
    return instance;
  }

  constructor() {
    this.ruleService = ServiceRegistry.getRuleService();
    this.profileService = ServiceRegistry.getProfileService();
  }

  regist(router) {
    // 创建规则
    //{
    //    name:name,
    //    description:description
    //}
    router.post('/rule/create', async (ctx, next) => {
      let userId = ctx.userId;
      let {name, description} = ctx.request.body;
      let ruleFileId = await this.ruleService.createRuleFile(userId, name, description);
      ctx.body = {
        code: 0,
        msg: 'ok',
        data: {
          id: ruleFileId
        }
      };
    });
    // 获取规则文件列表
    // /rule/filelist
    router.get('/rule/filelist', async (ctx, next) => {
      let userId = ctx.userId;
      let ruleFileList = await this.ruleService.getRuleFileList(userId);
      ctx.body = {
        code: 0,
        list: ruleFileList
      };
    });
    // 删除规则文件
    // /rule/deletefile?name=${name}
    router.get('/rule/deletefile', (ctx, next) => {
      let userId = ctx.userId;
      this.ruleService.deleteRuleFile(userId, ctx.query.id);
      ctx.body = {
        code: 0
      };
    });
    // 设置文件勾选状态
    // /rule/setfilecheckstatus?name=${name}&checked=${checked?1:0}
    router.get('/rule/setfilecheckstatus', (ctx, next) => {
      let userId = ctx.userId;
      this.ruleService.setRuleFileCheckStatus(userId, ctx.query.id,
        ctx.query.checked == 1 ? true : false);
      ctx.body = {
        code: 0
      };
    });
    // 获取规则文件
    // /rule/getfile?name=${name}
    router.get('/rule/getfile', async (ctx, next) => {
      let userId = ctx.userId;
      let content = this.ruleService.getRuleFile(userId, ctx.query.id);
      ctx.body = {
        code: 0,
        data: content
      };
    });

    router.get('/rule/file/raw', async (ctx, next) => {
      let userId = ctx.userId;
      let content = await this.ruleService.getRuleFile(userId, ctx.query.id);
      ctx.body = content;
    });
    // 保存规则文件
    // /rule/savefile?name=${name} ,content
    router.post('/rule/savefile', async (ctx, next) => {
      let userId = ctx.userId;
      await this.ruleService.saveRuleFile(userId, ctx.query.id, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });

    // 导出规则文件
    // /rule/download?name=${name}
    router.get('/rule/download', async (ctx, next) => {
      let userId = ctx.userId;
      let id = ctx.query.id;
      let content = await this.ruleService.getRuleFile(userId, id);
      ctx.set('Content-disposition', `attachment;filename=${encodeURIComponent(content.name)}.json`);
      ctx.body = content;
    });
    // 测试规则
    // /rule/test
    router.post('/rule/test', async (ctx, next) => {
      let userId = ctx.userId;
      let {
        requestMethod,// 请求method
        requestUrl,// 请求url
        matchMethod,// 匹配method
        matchUrl,// 匹配url
        target, // 转发末班
      } = ctx.request.body;

      let matchResult = '不匹配';
      let redirectResult;
      let message = '';

      let urlMatch = matchUrl && (requestUrl.indexOf(matchUrl) >= 0 || (new RegExp(matchUrl)).test(requestUrl));
      let methodMatch = !matchMethod || (requestMethod.toLowerCase().trim()) == (matchMethod.toLowerCase().trim());
      if (urlMatch && methodMatch) {
        matchResult = 'url匹配通过';
      }

      redirectResult = await this.profileService.calcPath(userId, requestUrl, matchUrl, target);

      // 测试规则
      ctx.body = {
        code: 0,
        data: {
          matchResult,
          redirectResult,
          message
        }
      };
    });
  }
};
