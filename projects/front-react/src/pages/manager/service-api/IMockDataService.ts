import IStateBase from "../../../common/IStateBase.ts";

export interface IMockItem {
  id: string,
  name: string,
  contenttype: string
}
export default interface IMockDataService extends IStateBase<IMockItem[]> {
}
