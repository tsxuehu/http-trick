import IUserService from "../service-api/IUserService.ts";

enum EService {
    IWorkbenchService = 'WorkbenchService',
    IUserService = 'UserService',
    IAppInfoService = 'AppInfoService',
    IConfigureService = 'ConfigureService',
    IMockDataService = 'DataService',
    IDeviceService = 'DeviceService',
    IFilterService = 'FilterService',
    IHostService = 'HostService',
    IProfileService = 'ProfileService',
    IRuleService = 'RuleService',
}
export default EService
