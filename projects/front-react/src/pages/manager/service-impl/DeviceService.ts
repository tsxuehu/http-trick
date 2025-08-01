import IDeviceService, { IDeviceInfo } from "../service-api/IDeviceService.ts";
import StateBase from "../../../common/StateBase.ts";

export default class DeviceService extends StateBase<IDeviceInfo[]> implements  IDeviceService {
  constructor() {
    super([]);
  }
}
