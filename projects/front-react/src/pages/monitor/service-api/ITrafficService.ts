import IStateBase from '../../../common/IStateBase.ts';

export interface ITraffic {
  userInfo: UserInfo;
  appInfo: IAppInfo;
  requestingClear: boolean;
  bindedDeviceList: any[];
  hostFileList: any[];
  recordMap: Record<string, any>;
  originRecordArray: any[];
  filteredRecordArray: any[];
  monitorState: IMonitorState;
  selectRecordId: string;
  rightClickedRecordId: string;
  rightClickedDeviceId: string;
  currentRequestBody: string;
  currentResponseBody: string;
  filter: IFilter;
}

export interface UserInfo {
  userId: string;
  deviceId: string;
  clientIp: string;
}

export interface IAppInfo {}

export interface IMonitorState {
  stopRecord: boolean;
  overflow: boolean;
}

export interface IFilter {
  host: string;
  path: string;
}

export interface TrafficRow {
  id: number;
  originRequest?: ITrafficOriginRequestData;
  requestData?: ITrafficRequestData;
  response?: ITrafficResponse;
}
export interface ITrafficOriginRequestData {
  hasContent: boolean;
  href: string;
  method: string;
  protocol: string;
  hostname: string;
  path: string;
  pathname: string;
  port: string;
  headers: Record<string, any>;
  query: Record<string, string>; // query对象
  cookie: Record<string, string>;
  clientIp: string;
  deviceId: string;
  httpVersion: string;
}
export interface ITrafficRequestData {
  originHostname?: string;
  method?: string;
  protocol?: string;
  hostname?: string; // ip地址
  port?: string;
  path?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}
export interface ITrafficResponse {
  remoteIp: string; // 远程服务器器ip
  receiveRequestTime: number; // 接收到请求的时间
  dnsResolveBeginTime: number; // dns解析开始时间
  remoteRequestBeginTime: number; // 请求开始时间
  remoteResponseStartTime: number; // 服务器响应开始时间
  remoteResponseEndTime: number; // 服务器响应结束时间
  requestEndTime: number; // 响应结束时间
  statusCode: number;
  headers: Record<string, string>; // 要发送给浏览器的header
}

export default interface ITrafficService extends IStateBase<ITraffic> {
  setUserInfo(userInfo: UserInfo): void;
  setAppInfo(appInfo: IAppInfo): void;
  setTraffic(trafficRecords: TrafficRow[]): void;
  setLocalFilter(filter: IFilter): void;
  setMonitorState(monitorState: IMonitorState): void;
  clearLocalMonitorData(): void;
  setBindedDeviceList(bindedDeviceList: any[]): void;
  setHostFileList(hostFileList: any[]): void;

  requestSetStopRecord(stop: boolean): Promise<void>;
  requestSetFilter(filter: IFilter): Promise<void>;
  requestClearMonitorData(): Promise<void>;
  selectRecordById(id: string): Promise<void>;
}
