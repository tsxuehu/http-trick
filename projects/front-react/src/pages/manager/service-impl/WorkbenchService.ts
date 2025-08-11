import * as profileApi from '../../../api/profile'
import IWorkbenchService from '../service-api/IWorkbenchService'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import EService from '../config/EService.ts'
import IAppInfoService, { IAppInfo } from '../service-api/IAppInfoService.ts'
import IConfigureService, { IConfigure } from '../service-api/IConfigureService.ts'
import IMockFileService, { IMockFile } from '../service-api/IMockFileService.ts'
import IDeviceService, { IDeviceInfo } from '../service-api/IDeviceService.ts'
import IFilterService from '../service-api/IFilterService.ts'
import IHostService, { IHostFileListItem } from '../service-api/IHostService.ts'
import IProfileService, { IUserProfile } from '../service-api/IProfileService.ts'
import IRuleService, { IRule, IRuleFileSimple } from '../service-api/IRuleService.ts'
import IUserService from '../service-api/IUserService.ts'

const appInfoService = getServiceSync<IAppInfoService>(EService.IAppInfoService)
const configureService = getServiceSync<IConfigureService>(EService.IConfigureService)
const mockDataService = getServiceSync<IMockFileService>(EService.IMockDataService)
const deviceService = getServiceSync<IDeviceService>(EService.IDeviceService)
const filterService = getServiceSync<IFilterService>(EService.IFilterService)
const hostService = getServiceSync<IHostService>(EService.IHostService)
const profileService = getServiceSync<IProfileService>(EService.IProfileService)
const ruleService = getServiceSync<IRuleService>(EService.IRuleService)
const userService = getServiceSync<IUserService>(EService.IUserService)

export default class WorkbenchService implements IWorkbenchService {
  async start(query: Record<string, string>): Promise<void> {
    this.initSocketIO()
    const userId = await profileApi.getUserId()
    userService.setUserId(userId)
  }

  initSocketIO() {
    const io = (window as any).io
    if (!io) {
      console.error('没有websock环境')
      return
    }
    let socket = io('/manager')

    socket.on('appinfo', (data: IAppInfo) => {
      appInfoService.setAppInfo(data)
    })

    socket.on('configure', (data: IConfigure) => {
      configureService.setConfig(data)
    })

    socket.on('profile', (data: IUserProfile) => {
      profileService.setProfile(data)
    })

    socket.on('bindedDeviceList', (data: IDeviceInfo[]) => {
      deviceService.setDeviceList(data)
    })

    socket.on('hostfilelist', (data: IHostFileListItem[]) => {
      hostService.setHostFileList(data)
    })

    socket.on('rulefilelist', (data: IRuleFileSimple[]) => {
      ruleService.setRuleFileList(data)
    })

    socket.on('filters', (data: IRule[]) => {
      filterService.setFilters(data)
    })

    socket.on('datalist', (data: IMockFile[]) => {
      mockDataService.setMockFileList(data)
    })
  }
}
