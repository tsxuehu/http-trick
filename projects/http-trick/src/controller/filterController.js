/**
 * Created by tsxuehu on 4/11/17.
 */
const ServiceRegistry = require("../../../service");
let instance;
module.exports = class FilterController {
  static getInstance() {
    if (!instance) {
      instance = new FilterController();
    }
    return instance;
  }

  constructor() {
    this.filterService = ServiceRegistry.getFilterService();

  }

  regist(router) {
    router.get('/filter/setRuleCheckedState', async (ctx, next) => {
      let userId = ctx.userId;
      let {ruleId, checked} = ctx.query;
      await this.filterService.setRuleCheckedState(userId, ruleId, checked == 1);
      ctx.body = {
        code: 0
      };
    });
    router.post('/filter/saveRule', async (ctx, next) => {
      let userId = ctx.userId;
      await this.filterService.saveRule(userId, ctx.request.body);
      ctx.body = {
        code: 0
      };
    });
    router.get('/filter/removeRule', async (ctx, next) => {
      let userId = ctx.userId;
      let {ruleId} = ctx.query;
      await this.filterService.removeRule(userId, ruleId);
      ctx.body = {
        code: 0
      };
    });
  }

}
