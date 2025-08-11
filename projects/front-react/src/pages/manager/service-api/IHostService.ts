import IStateBase from '../../../common/IStateBase.ts'

export interface IHostFile {
  meta: Meta
  id: string
  userId: string
  readonly: boolean
  default: boolean
  checked: boolean
  name: string
  description: string
  content: string
}
export interface Meta {
  local: boolean
}
export interface IHostFileListItem {
  id: string
  name: string
  checked: boolean
  description: string
  meta: Meta
}

export default interface IHostService extends IStateBase<{ hostFileList: IHostFileListItem[] }> {
  setHostFileList(hostFileList: IHostFileListItem[]): void
  getHostFileList(): IHostFileListItem[]
}
