import IWorkbenchService from '../service-api/IWorkbenchService';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import ITrafficService, { TrafficRow } from '../service-api/ITrafficService.ts';
import EService from '../config/EService.ts';
import * as profileApi from '../../../api/profile.ts';
import * as appApi from '../../../api/app.ts';

const trafficService = getServiceSync<ITrafficService>(EService.ITrafficService);

export default class WorkbenchService implements IWorkbenchService {
  async start(query: Record<string, string>): Promise<void> {
    this.initSocketIO();
    const userInfo = await profileApi.getUserInfo();
    const appInfo = await appApi.getAppInfo();
    trafficService.setUserInfo(userInfo);
    trafficService.setAppInfo(appInfo);
  }

  initSocketIO() {
    const io = (window as any).io;
    if (!io) {
      console.error('没有websock环境');
      return;
    }
    let socket = io('/httptrafic');
    socket.on('rows', (rows: TrafficRow[]) => {
      trafficService.setTraffic(rows);
    });

    socket.on('filter', (filter: any) => {
      trafficService.setLocalFilter(filter);
    });

    socket.on('state', (state: any) => {
      trafficService.setMonitorState(state);
    });

    socket.on('clear', () => {
      trafficService.clearLocalMonitorData();
    });

    socket.on('bindedDeviceList', (deviceList: any) => {
      trafficService.setBindedDeviceList(deviceList);
    });

    socket.on('hostfilelist', (data: any) => {
      trafficService.setHostFileList(data);
    });
  }
}
