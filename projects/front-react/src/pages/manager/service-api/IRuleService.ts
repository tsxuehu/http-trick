import IStateBase from "../../../common/IStateBase.ts";

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

export interface IAction {
  type: string;
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

export default interface IRuleService extends IStateBase<IRuleFileSimple[]> {
}
