import IStateBase from '../../../common/IStateBase.ts';

export interface IDataFileEntry {
  id: string;
  name: string;
  contenttype: EContentType;
}
export enum EContentType {
  html = 'text/html',
  json = 'application/json',
  javascript = 'application/javascript',
}
export default interface IDataFileService extends IStateBase<{ dataFileList: IDataFileEntry[] }> {
  setDataFileEntryList(dataFileList: IDataFileEntry[]): void;
  getDataFileEntryList(): IDataFileEntry[];

  createDataFileEntry(dataFileEntry: IDataFileEntry): Promise<void>;
  removeDataFileEntry(dataFileEntry: IDataFileEntry): Promise<void>;

  getDataFile(id: string): Promise<string>;
  saveDataFile(id: string, content: string): Promise<void>;
}
