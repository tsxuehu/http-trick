import { IActualRequestData, IOriginRequestData, IToClientResponse } from 'service/intercept/http';

export interface IFilter {
  host: string;
  path: string;
}

export interface IStatus {
  stopRecord: boolean;
  overflow: boolean;
}

export interface IRequestBeginInfo {
  id: number;
  userId: string;
  clientIp: string;
  deviceId: string;
  method: string;
  httpVersion: string;
  originRequestData: IOriginRequestData;
}

export interface IActualRequestInfo {
  id: number;
  userId: string;
  requestData: IActualRequestData;
  originBody: string;
}

export interface IServerReturnInfo {
  userId: string;
  id: number;
  toClientResponse: IToClientResponse;
}
export interface ITrafficOriginRequestData extends IOriginRequestData {
  clientIp: string;
  method: string;
  deviceId: string;
  httpVersion: string;
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
export interface TrafficRow {
  id: number;
  originRequest?: ITrafficOriginRequestData;
  requestData?: IActualRequestData;
  response?: ITrafficResponse;
}
