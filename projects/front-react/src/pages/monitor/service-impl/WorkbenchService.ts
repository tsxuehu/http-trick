import IWorkbenchService from '../service-api/IWorkbenchService'

/**
 *  url格式
 *  https://xxx.xxx.xxx/rpa-fe/agent-chat/index?
 */
export default class WorkbenchService implements IWorkbenchService {
  async start(query: Record<string, string>): Promise<void> {

  }
}
