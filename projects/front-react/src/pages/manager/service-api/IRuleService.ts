import IStateBase from '../../../common/IStateBase.ts';

export interface IRuleFile {
  id: string;
  userId: string;
  meta: IRuleFileMeta;
  checked: boolean;
  name: string;
  description: string;
  ruleList: IRule[];
}

export interface IRuleFileSimple {
  id: string;
  meta: IRuleFileMeta;
  checked: boolean;
  name: string;
  description: string;
}

export interface IRuleFileMeta {
  remote: boolean;
  url?: string;
}

export interface IRule {
  name: string;
  id: string;
  method: string;
  match: string;
  checked: boolean;
  actionList: IAction[];
}
export enum EAction {
  addQuery = 'addQuery',
  addRequestCookie = 'addRequestCookie',
  addRequestHeader = 'addRequestHeader',
  addResponseHeader = 'addResponseHeader',
  bypass = 'bypass',
  mockData = 'mockData',
  modifyResponse = 'modifyResponse',
  redirect = 'redirect',
  scriptModifyRequest = 'scriptModifyRequest',
  scriptModifyResponse = 'scriptModifyResponse',
}
export interface IAction {
  type: EAction;
  data: IActionData;
}

export interface IActionData {
  target?: string;
  dataId?: string;
  modifyResponseType?: string;
  callbackName?: string;
  cookieKey?: string;
  cookieValue?: string;
  reqHeaderKey?: string;
  reqHeaderValue?: string;
  resHeaderKey?: string;
  resHeaderValue?: string;
  queryKey?: string;
  queryValue?: string;
  modifyRequestScript?: string;
  modifyResponseScript?: string;
}
export interface IHttpApiInfo {
  method: string;
  url: string;
}
export interface IMatchResult {
  matchResult: string; // 匹配结果
  redirectResult: string; // 转发结果
  message: string;
}

export default interface IRuleService extends IStateBase<{ ruleFileList: IRuleFileSimple[] }> {
  getRuleFileList(): IRuleFileSimple[];
  setRuleFileList(ruleFileList: IRuleFileSimple[]): void;

  testRule(match: IHttpApiInfo, target: string, request: IHttpApiInfo): Promise<IMatchResult>;
  getReferenceVar(content: string): string[];

  createFile(name: string, description: string): Promise<string>;
  getFileContent(id: string): Promise<IRuleFile>;
  setFileCheckStatus(ruleFileId: string, check: boolean): Promise<void>;
  saveRuleFile(id: string, content: any): Promise<void>;
  deleteRuleFile(id: string): Promise<void>;

  setRuleCheckedState(ruleFileId: string, ruleId: string, checked: boolean): Promise<void>;
  saveRule(ruleFileId: string, rule: IRule): Promise<void>;
  removeRule(ruleFileId: string, ruleId: string): Promise<void>;
}
