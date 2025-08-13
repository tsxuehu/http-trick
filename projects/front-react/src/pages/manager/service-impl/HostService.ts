import IHostService, { IHostFile, IHostFileListItem } from '../service-api/IHostService.ts';
import StateBase from '../../../common/StateBase.ts';
import * as hostApi from '../../../api/host.ts';

export default class HostService extends StateBase<{ hostFileList: IHostFileListItem[] }> implements IHostService {
  constructor() {
    super({ hostFileList: [] });
  }

  setHostFileList(hostFileList: IHostFileListItem[]): void {
    this.setState({ hostFileList });
  }
  getHostFileList(): IHostFileListItem[] {
    return this.getState().hostFileList;
  }

  async createFile(name: string, description: string): Promise<void> {
    await hostApi.createFile(name, description);
  }
  async useFile(id: string): Promise<void> {
    await hostApi.useFile(id);
  }
  async deleteFile(id: string): Promise<void> {
    await hostApi.deleteFile(id);
  }
  async getFileContent(id: string): Promise<IHostFile> {
    return await hostApi.getFileContent(id);
  }
  async saveFile(id: string, content: IHostFile): Promise<void> {
    await hostApi.saveFile(id, content);
  }
}
