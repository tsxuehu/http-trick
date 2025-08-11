import IRuleService, { IRuleFileSimple } from '../service-api/IRuleService'
import StateBase from '../../../common/StateBase'
import * as ruleApi from '../../../api/rule'

export default class RuleService extends StateBase<{ ruleFileList: IRuleFileSimple[] }> implements IRuleService {
  constructor() {
    super({ ruleFileList: [] })
  }

  getRuleFileList(): IRuleFileSimple[] {
    return this.getState().ruleFileList
  }

  setRuleFileList(ruleFileList: IRuleFileSimple[]): void {
    this.setState({ ruleFileList })
  }

  async setFileCheckStatus(ruleFileId: string, check: boolean) {
    await ruleApi.setFileCheckStatus(ruleFileId, check)
  }
}
