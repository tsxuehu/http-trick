import IStateBase from "../../../common/IStateBase.ts";

export interface IUserInfo {
    userId: string

}

export default interface IUserService extends IStateBase<IUserInfo> {
  isRoot(): boolean
}
