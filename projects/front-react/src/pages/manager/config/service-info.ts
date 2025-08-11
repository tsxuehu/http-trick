import EService from './EService'
import WorkbenchService from '../service-impl/WorkbenchService'
import AppInfoService from '../service-impl/AppInfoService.ts'
import ConfigureService from '../service-impl/ConfigureService.ts'
import MockFileService from '../service-impl/MockFileService.ts'
import DeviceService from '../service-impl/DeviceService.ts'
import FilterService from '../service-impl/FilterService.ts'
import HostService from '../service-impl/HostService.ts'
import ProfileService from '../service-impl/ProfileService.ts'
import RuleService from '../service-impl/RuleService.ts'
import UserService from '../service-impl/UserService.ts'

const services = {
  [EService.IWorkbenchService]: new WorkbenchService(),
  [EService.IUserService]: new UserService(),
  [EService.IAppInfoService]: new AppInfoService(),
  [EService.IConfigureService]: new ConfigureService(),
  [EService.IMockDataService]: new MockFileService(),
  [EService.IDeviceService]: new DeviceService(),
  [EService.IFilterService]: new FilterService(),
  [EService.IHostService]: new HostService(),
  [EService.IProfileService]: new ProfileService(),
  [EService.IRuleService]: new RuleService(),
}
export default services
