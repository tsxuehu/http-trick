import IStateBase from '../../../common/IStateBase.ts'

export interface IMockFile {
  id: string
  name: string
  contenttype: string
}
export default interface IMockFileService extends IStateBase<{ mockFileList: IMockFile[] }> {
  setMockFileList(mockFileList: IMockFile[]): void
  getMockFileList(): IMockFile[]
}
