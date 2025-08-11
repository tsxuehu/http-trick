import IHostService, { IHostFileListItem } from '../service-api/IHostService.ts'
import StateBase from '../../../common/StateBase.ts'
import * as hostApi from '../../../api/host.ts'

export default class HostService extends StateBase<{ hostFileList: IHostFileListItem[] }> implements IHostService {
  constructor() {
    super({ hostFileList: [] })
  }

  setHostFileList(hostFileList: IHostFileListItem[]): void {
    this.setState({ hostFileList })
  }
  getHostFileList(): IHostFileListItem[] {
    return this.getState().hostFileList
  }

  async selectHostFile(id: string) {
    await hostApi.useFile(id)
  }
}
