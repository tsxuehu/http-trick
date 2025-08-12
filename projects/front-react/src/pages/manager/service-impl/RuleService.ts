import IRuleService, {
  IHttpApiInfo,
  IMatchResult,
  IRule,
  IRuleFile,
  IRuleFileSimple,
} from '../service-api/IRuleService';
import StateBase from '../../../common/StateBase';
import * as ruleApi from '../../../api/rule';
import trim from 'lodash/trim';
import keys from 'lodash/keys';

export default class RuleService extends StateBase<{ ruleFileList: IRuleFileSimple[] }> implements IRuleService {
  constructor() {
    super({ ruleFileList: [] });
  }

  getRuleFileList(): IRuleFileSimple[] {
    return this.getState().ruleFileList;
  }

  setRuleFileList(ruleFileList: IRuleFileSimple[]): void {
    this.setState({ ruleFileList });
  }

  async testRule(match: IHttpApiInfo, target: string, request: IHttpApiInfo): Promise<IMatchResult> {
    return await ruleApi.testRule({
      requestMethod: request.method, // 请求method
      requestUrl: request.url, // 请求url
      matchMethod: match.method, // 匹配method
      matchUrl: match.url, // 匹配url
      target, // 转发末班
    });
  }

  getReferenceVar(content: any): string[] {
    const contentStr = JSON.stringify(content);
    const reg1 = RegExp('<%=(.+?)%>', 'g');
    const reg2 = RegExp('\\$\\{(.+?)\\}', 'g');
    let result;
    const varObj = {};
    while ((result = reg1.exec(contentStr)) != null) {
      // @ts-ignore
      varObj[trim(result[1])] = 1;
    }
    while ((result = reg2.exec(contentStr)) != null) {
      // @ts-ignore
      varObj[trim(result[1])] = 1;
    }
    return keys(varObj);
  }

  async createFile(name: string, description: string): Promise<string> {
    const res = await ruleApi.createFile(name, description);
    return res.id;
  }

  async getFileContent(id: string): Promise<IRuleFile> {
    return await ruleApi.getFileContent(id);
  }

  async setFileCheckStatus(ruleFileId: string, check: boolean) {
    await ruleApi.setFileCheckStatus(ruleFileId, check);
  }

  async saveRuleFile(id: string, content: any): Promise<void> {
    await ruleApi.saveRuleFile(id, content);
  }

  async deleteRuleFile(id: string): Promise<void> {
    await ruleApi.deleteFile(id);
  }

  async setRuleCheckedState(ruleFileId: string, ruleId: string, checked: boolean): Promise<void> {
    await ruleApi.setRuleCheckedState(ruleFileId, ruleId, checked);
  }

  async saveRule(ruleFileId: string, rule: IRule): Promise<void> {
    await ruleApi.saveRule(ruleFileId, rule);
  }

  async removeRule(ruleFileId: string, ruleId: string): Promise<void> {
    await ruleApi.removeRule(ruleFileId, ruleId);
  }
}
