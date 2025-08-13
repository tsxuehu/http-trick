import IDataFileService, { IDataFileEntry } from '../service-api/IDataFileService.ts';
import StateBase from '../../../common/StateBase.ts';
import * as dataApi from '../../../api/data.ts';
export default class DataFileService extends StateBase<{ dataFileList: IDataFileEntry[] }> implements IDataFileService {
  constructor() {
    super({ dataFileList: [] });
  }

  setDataFileEntryList(dataFileList: IDataFileEntry[]): void {
    this.setState({ dataFileList });
  }

  getDataFileEntryList(): IDataFileEntry[] {
    return this.getState().dataFileList;
  }
  async createDataFileEntry(dataFileEntry: IDataFileEntry): Promise<void> {
    await dataApi.createDataFile(dataFileEntry);
  }
  async removeDataFileEntry(mockFile: IDataFileEntry): Promise<void> {
    await dataApi.removeDataFile(mockFile);
  }
  async getDataFile(id: string): Promise<string> {
    return await dataApi.getDataFile(id);
  }
  async saveDataFile(id: string, content: string): Promise<void> {
    await dataApi.saveDataFile(id, content);
  }
}
