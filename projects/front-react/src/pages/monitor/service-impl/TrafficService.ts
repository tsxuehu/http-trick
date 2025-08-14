import ITrafficService, {
  IAppInfo,
  IFilter,
  IMonitorState,
  ITraffic,
  TrafficRow,
  UserInfo,
} from '../service-api/ITrafficService.ts';
import StateBase from '../../../common/StateBase.ts';
import * as trafficApi from '../../../api/traffic.ts';
import { produce } from 'immer';

export default class TrafficService extends StateBase<ITraffic> implements ITrafficService {
  constructor() {
    super({
      userInfo: {
        userId: 'guest',
        deviceId: '',
        clientIp: '',
      },
      requestingClear: false,
      appInfo: {},
      bindedDeviceList: [],
      // host文件列表
      hostFileList: [],

      // 监控数据
      // 记录id 和 row中索引的映射关系
      recordMap: {}, // 当前所有记录
      originRecordArray: [], // 原始记录数组 存放记录id
      filteredRecordArray: [], // 过滤后的数组 存放记录id
      monitorState: {
        stopRecord: false, // 停止记录
        overflow: false, // 打到最大记录数显示
      },

      // 交互数据
      selectRecordId: '', //当前选择的记录
      rightClickedRecordId: '', // 右击的记录id
      rightClickedDeviceId: '', // 右击的设备id
      currentRequestBody: '', // 选择记录的请求body
      currentResponseBody: '', // 选择记录的响应body

      filter: {
        // 过滤器
        host: '',
        path: '',
      },
    });
  }

  setUserInfo(userInfo: UserInfo): void {
    this.setState({
      userInfo,
    });
  }

  setAppInfo(appInfo: IAppInfo): void {
    this.setState({ appInfo });
  }

  setTraffic(trafficRecords: TrafficRow[]): void {
    const state = this.getState();
    const { monitorState, filter, requestingClear } = state;
    if (monitorState.stopRecord || requestingClear) {
      return;
    }
    let { host: hostFilter, path: pathFilter } = filter;

    const newState = produce(state, (draft) => {
      const { recordMap, originRecordArray, filteredRecordArray } = draft;
      for (let row of trafficRecords) {
        let id = row.id;
        let hasRecieved = !!recordMap[id];
        let record = recordMap[id] || {};
        Object.assign(record, row);

        recordMap[id] = record;

        if (!hasRecieved) {
          originRecordArray.push(id);
        }
        // 根据host、path进行过滤
        let originRequest = row.originRequest;
        if (
          originRequest &&
          originRequest.hostname.indexOf(hostFilter) > -1 &&
          originRequest.path.indexOf(pathFilter) > -1
        ) {
          filteredRecordArray.push(id);
        }
      }
    });
    this.setState(newState);
  }

  setLocalFilter(filter: IFilter): void {
    const state = this.getState();
    const { originRecordArray, filter: origin, recordMap } = state;

    if (origin.path == filter.path && origin.host == filter.host) {
      return;
    }
    // 过滤数据
    let filtered = [];
    let { host: hostFilter, path: pathFilter } = filter;
    for (let originId of originRecordArray) {
      const row = recordMap[originId];
      let originRequest = row.originRequest;
      if (
        originRequest &&
        originRequest.hostname.indexOf(hostFilter) > -1 &&
        originRequest.path.indexOf(pathFilter) > -1
      ) {
        filtered.push(row.id);
      }
    }
    this.setState({
      filter,
      filteredRecordArray: filtered,
    });
  }

  setMonitorState(monitorState: IMonitorState): void {
    this.setState({ monitorState });
  }

  clearLocalMonitorData(): void {
    this.setState({
      requestingClear: false,
      recordMap: {},
      originRecordArray: [],
      filteredRecordArray: [],
      selectRecordId: '',
      currentRequestBody: '',
      currentResponseBody: '',
    });
  }

  setBindedDeviceList(bindedDeviceList: any[]): void {
    this.setState({ bindedDeviceList });
  }

  setHostFileList(hostFileList: any[]): void {
    this.setState({ hostFileList });
  }

  async requestSetStopRecord(stop: boolean): Promise<void> {
    await trafficApi.setStopRecord(stop);
  }

  async requestSetFilter(filter: IFilter): Promise<void> {
    await trafficApi.setFilter(filter);
  }

  async requestClearMonitorData(): Promise<void> {
    this.setState({
      requestingClear: true,
    });
    await trafficApi.clear();
  }

  async selectRecordById(id: string): Promise<void> {
    const { selectRecordId, recordMap } = this.getState();
    if (selectRecordId == id) {
      return;
    }
    this.setState({
      selectRecordId: id,
      currentRequestBody: '',
      currentResponseBody: '',
    });
    const currentRow = recordMap[id];
    if (/(json)|(x-www-form-urlencoded)/i.test(currentRow.originRequest.headers['content-type'])) {
      // 请求后端 拿数据
      const reqBody = await trafficApi.getRequestBody(id);
      this.setState({
        currentRequestBody: reqBody,
      });
    }
    // 如果是html json数据 向后端请求拿数据
    try {
      if (/(text)|(javascript)|(json)/i.test(currentRow.response.headers['content-type'])) {
        // 请求后端 拿数据
        const resBody = await trafficApi.getResponseBody(id);
        this.setState({
          currentResponseBody: resBody,
        });
      }
    } catch (e) {
      console.log('请求body数据失败', currentRow, e);
    }
  }
}
