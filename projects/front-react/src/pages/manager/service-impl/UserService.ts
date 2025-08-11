import StateBase from '../../../common/StateBase.ts'
import IUserService, { IUserInfo } from '../service-api/IUserService.ts'

export default class UserService extends StateBase<IUserInfo> implements IUserService {
  constructor() {
    super({
      userId: 'root',
    })
  }

  setUserId(userId: string): void {
    this.setState({ userId })
  }

  isRoot(): boolean {
    const userId = this.getState().userId
    return userId === 'root'
  }
}
