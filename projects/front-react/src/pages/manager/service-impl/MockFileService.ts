import IMockFileService, { IMockFile } from '../service-api/IMockFileService.ts'
import StateBase from '../../../common/StateBase.ts'

export default class MockFileService extends StateBase<{ mockFileList: IMockFile[] }> implements IMockFileService {
  constructor() {
    super({ mockFileList: [] })
  }

  setMockFileList(mockFileList: IMockFile[]): void {
    this.setState({ mockFileList })
  }

  getMockFileList(): IMockFile[] {
    return this.getState().mockFileList
  }
}
