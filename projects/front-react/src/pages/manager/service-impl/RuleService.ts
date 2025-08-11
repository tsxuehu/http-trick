import IRuleService, { IHttpApiInfo, IMatchResult, IRuleFileSimple } from '../service-api/IRuleService'
import StateBase from '../../../common/StateBase'
import * as ruleApi from '../../../api/rule'

export default class RuleService extends StateBase<{ ruleFileList: IRuleFileSimple[] }> implements IRuleService {
  constructor() {
    super({ ruleFileList: [] })
  }

  async testRule(match: IHttpApiInfo, target: string, request: IHttpApiInfo): Promise<IMatchResult> {
    return await ruleApi.testRule({
      requestMethod: request.method, // 请求method
      requestUrl: request.url, // 请求url
      matchMethod: match.method, // 匹配method
      matchUrl: match.url, // 匹配url
      target, // 转发末班
    })
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
