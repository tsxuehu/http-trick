import IRuleService, { IRuleFileSimple } from "../service-api/IRuleService";
import StateBase from "../../../common/StateBase";
import * as ruleApi from "../../../api/rule";

export default class RuleService extends StateBase<IRuleFileSimple[]> implements IRuleService {
  constructor() {
    super([]);
  }

  async setFileCheckStatus(ruleFileId: string, check: boolean) {
    await ruleApi.setFileCheckStatus(ruleFileId, check);
  }
}
