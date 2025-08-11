import IDeviceService, { IDeviceInfo } from '../service-api/IDeviceService.ts'
import StateBase from '../../../common/StateBase.ts'

export default class DeviceService extends StateBase<{ deviceList: IDeviceInfo[] }> implements IDeviceService {
  constructor() {
    super({ deviceList: [] })
  }

  setDeviceList(deviceList: IDeviceInfo[]): void {
    this.setState({ deviceList })
  }
  getDeviceList(): IDeviceInfo[] {
    return this.getState().deviceList
  }
}
