import IHostService, { IHostFileListItem } from "../service-api/IHostService.ts";
import StateBase from "../../../common/StateBase.ts";
import * as hostApi from "../../../api/host.ts";

export default class HostService extends StateBase<IHostFileListItem[]> implements IHostService {
  constructor() {
    super([]);
  }

  async selectHostFile(id: string) {
    await hostApi.useFile(id);
  }
}
