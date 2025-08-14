import { Resource, Service } from '@spring4js/container-node';
import path from 'path';
import EventEmitter from 'events';
import AppInfoService from 'service/AppInfoService';
import {
  IActualRequestInfo,
  IFilter,
  IRequestBeginInfo,
  IServerReturnInfo,
  IStatus,
  TrafficRow,
} from 'service/intercept/http-trafific';
import forEach from 'lodash/forEach';
import FileService from 'service/infra/FileService';
import { IOriginRequestData } from 'service/intercept/http';

const logCountPerUser = 500;
/**
 * 缓存监控数据、发送给监控窗
 * 记录用户打开的监控窗数量
 * 每个用户最多只记录500个请求，超过500个后 不在记录
 */
@Service()
export default class HttpTrafficService extends EventEmitter {
  @Resource() private appInfoService: AppInfoService;
  @Resource() private fileService: FileService;

  private cache: Record<string, TrafficRow[]> = {}; // http请求缓存数据 userId - > [{record}，{record}，{record}]
  private userRequestPointer: Record<string, number> = {}; // 用户的请求id  一个用户可以关联多个请求设备，用户的请求分配唯一个一个请求id
  private userMonitorCount: Record<string, number> = {}; // 记录用户的监视窗数量
  private filterMap: Record<string, IFilter> = {};
  private stopRecord: Record<string, boolean> = {};

  private trafficDir: string; // 监控数据缓存目录

  async start() {
    // 删除缓存
    /* rimraf.sync(this.trafficDir);
         fs.mkdirSync(this.trafficDir);*/
    let proxyDataDir = this.appInfoService.getProxyDataDir();
    this.trafficDir = path.join(proxyDataDir, 'traffic');

    // 创建定时任务，推送日志记录
    setInterval((_) => {
      this.sendCachedData();
    }, 2000);
  }

  getFilter(userId: string): IFilter {
    return this.filterMap[userId] || { host: '', path: '' };
  }

  setFilter(userId: string, filter: IFilter) {
    this.filterMap[userId] = filter;
    this.emit('filter', userId, filter);
  }

  getStatus(userId: string): IStatus {
    return {
      stopRecord: this.stopRecord[userId] || false,
      overflow: this.userRequestPointer[userId] > logCountPerUser,
    };
  }

  setStopRecord(userId: string, stop: boolean) {
    this.stopRecord[userId] = stop;
    // 发送通知
    this.emit('state-change', userId, this.getStatus(userId));
  }

  clear(userId: string) {
    this.userRequestPointer[userId] = 0;
    // 发送通知
    this.emit('clear', userId);
  }

  // 将缓存数据发送给用户
  sendCachedData() {
    forEach(this.cache, (rows, userId) => {
      this.emit('traffic', userId, rows);
    });
    this.cache = {};
  }

  // 为请求分配id
  getRequestId(userId: string, originRequestData: IOriginRequestData): number {
    // 处于停止记录状态 则不返回id
    if (this.stopRecord[userId]) return -1;

    // 获取当前ip
    let id = this.userRequestPointer[userId] || 0;

    // 超过500个请求则不再记录
    if (id > logCountPerUser) {
      return -1;
    }

    let filter = this.getFilter(userId);
    let { path, hostname } = originRequestData;
    if (path.indexOf(filter.path) > -1 && hostname.indexOf(filter.host) > -1) {
      id++;
      this.userRequestPointer[userId] = id;
      if (id > logCountPerUser) {
        let state = this.getStatus(userId);
        // 向监控窗推送通知
        this.emit('state-change', userId, state);
      }
      return id;
    }
    return -1;
  }

  resetRequestId(userId: string) {
    this.userRequestPointer[userId] = 0;
  }

  // 获取监控窗口的数量，没有监控窗口 则不做记录
  hasMonitor(userId: string) {
    let cnt = this.userMonitorCount[userId] || 0;
    return cnt > 0;
  }

  // 用户监控窗数加1
  incMonitor(userId: string) {
    let cnt = this.userMonitorCount[userId] || 0;
    if (cnt == 0) {
      this.resetRequestId(userId);
    }
    cnt++;
    this.userMonitorCount[userId] = cnt;
  }

  // 用户监控窗数减一
  decMonitor(userId: string) {
    let cnt = this.userMonitorCount[userId] || 0;
    cnt--;
    this.userMonitorCount[userId] = cnt;
  }

  // 记录请求
  requestBegin(info: IRequestBeginInfo) {
    const { id, userId, clientIp, deviceId, method, httpVersion, originRequestData } = info;
    let queue = this.cache[userId] || [];
    // 原始请求信息
    queue.push({
      id: id,
      originRequest: Object.assign(
        {
          clientIp,
          method,
          deviceId,
          httpVersion,
        },
        originRequestData,
      ),
    });

    this.cache[userId] = queue;
  }

  // 记录请求body
  async actualRequest(info: IActualRequestInfo) {
    const { userId, id, requestData, originBody } = info;
    // 将body写文件

    let body = requestData.body;
    delete requestData.body;

    let queue = this.cache[userId] || [];
    queue.push({
      id: id,
      requestData,
    });
    this.cache[userId] = queue;

    if (body) {
      let bodyPath = this.getRequestBodyPath(userId, id);
      await this.fileService.writeFile(bodyPath, body);
    }
    if (originBody) {
      let bodyPath = this.getOriginRequestBodyPath(userId, id);
      await this.fileService.writeFile(bodyPath, originBody);
    }
  }

  // 记录响应
  async serverReturn(info: IServerReturnInfo) {
    const { userId, id, toClientResponse } = info;
    let queue = this.cache[userId] || [];
    let {
      statusCode,
      headers,
      receiveRequestTime,
      dnsResolveBeginTime,
      remoteRequestBeginTime,
      remoteResponseStartTime,
      remoteResponseEndTime,
      requestEndTime,
      remoteIp,
      body,
    } = toClientResponse;
    queue.push({
      id: id,
      response: {
        statusCode,
        headers,
        receiveRequestTime,
        dnsResolveBeginTime,
        remoteRequestBeginTime,
        remoteResponseStartTime,
        remoteResponseEndTime,
        requestEndTime,
        remoteIp,
      },
    });

    this.cache[userId] = queue;

    if (body) {
      let bodyPath = this.getResponseBodyPath(userId, id);
      await this.fileService.writeFile(bodyPath, body);
    }
  }

  /**
   * 获取请求的请求内容
   * @param userId
   * @param requestId
   */
  async getRequestBody(userId: string, requestId: number): Promise<string> {
    let saveRequestPath = this.getRequestBodyPath(userId, requestId);
    return await this.fileService.readFile(saveRequestPath);
  }

  /**
   * 获取请求的请求内容
   * @param userId
   * @param requestId
   */
  async getResponseBody(userId: string, requestId: number): Promise<string> {
    let saveResponsePath = this.getResponseBodyPath(userId, requestId);
    return await this.fileService.readFile(saveResponsePath);
  }

  // 获取请求记录path
  getRequestBodyPath(userId: string, requestId: number): string {
    return path.join(this.trafficDir, userId + '_' + requestId + '_req_body');
  }

  getOriginRequestBodyPath(userId: string, requestId: number): string {
    return path.join(this.trafficDir, userId + '_' + requestId + '_req_body_origin');
  }

  // 获取响应记录path
  getResponseBodyPath(userId: string, requestId: number): string {
    return path.join(this.trafficDir, userId + '_' + requestId + '_res_body');
  }
}
