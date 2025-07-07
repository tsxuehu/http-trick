import {Resource, Service} from "di/annotation";
import AppInfoService from "service/AppInfoService";
import ProfileService from "service/manage/ProfileService";
import ActionService from "service/intercept/ActionService";
import log4js from "log4js";
import {IncomingMessage, ServerResponse} from "http";
import HttpTrafficService from "service/intercept/HttpTrafficService";
import {
    getDefaultProcessContext,
    getDefaultRequestContent,
    IProcessContext,
} from "../http";
import {IAction, IActionInfo} from "service/manage/rule";
import HostResolveService from "service/intercept/HostResolveService";
import tls from "tls";

const logger = log4js.getLogger('HttpProcessService')


@Service()
export default class HttpProcessService {
    @Resource() private appInfoService: AppInfoService
    @Resource() private profileService: ProfileService
    @Resource() private actionService: ActionService
    @Resource() private httpTrafficService: HttpTrafficService
    @Resource() private hostResolveService: HostResolveService

    /**
     * 正常的http请求处理流程，
     * 处理流程 更具转发规则、mock规则
     */
    async handle(req: IncomingMessage, res: ServerResponse) {

        let clientIp = ''; // 设备ip
        let deviceId = '';// 设备id
        let userId = '';// 设备绑定的用户id
        let urlObj: URL;
        const socket = req.socket
        const socks5Id = (socket as any).socks5Id;

        const isTls = (socket as tls.TLSSocket).encrypted


        if (socks5Id) { // socks5协议
            // 通过socks5信息 获取
            const info = this.hostResolveService.getSocks5ProxyConnectInfo(socks5Id)
            clientIp = info.targetPort
            deviceId = info.deviceId
            userId = info.userId
            urlObj = new URL(`${isTls ? 'https' : 'http'}://${info.targetHost}:${info.targetPort}${req.url}`)
        } else {// http代理协议
            const socket = req.socket
            if ((socket as tls.TLSSocket).encrypted) {
                const info = this.hostResolveService.getHttpProxyConnectInfo(socket.remotePort)
                clientIp = info.targetPort
                deviceId = info.deviceId
                userId = info.userId
                urlObj = new URL(`https://${info.targetHost}:${info.targetPort}${req.url}`)
            } else {
                clientIp = socket.remoteAddress;
                deviceId = clientIp; // 将设备的ip当做设备的id
                userId = this.profileService.getUserIdBindDevice(deviceId);
                urlObj = new URL(req.url);
            }
        }


        let recordResponse: boolean = false
        let requestId: number = -1;

        const isWebUiRequest = this.appInfoService.isWebUiRequest(urlObj.hostname, urlObj.port)
        if (!isWebUiRequest) {
            const hasMonitor = this.httpTrafficService.hasMonitor(userId)
            const isDeviceEnable = this.profileService.isDeviceEnableMonitor(deviceId);
            if (hasMonitor && isDeviceEnable) {
                requestId = this.httpTrafficService.getRequestId(userId, urlObj);
                if (requestId > -1) {
                    recordResponse = true;
                }
            }
        }

        // 解析请求参数
        const context = getDefaultProcessContext({
            req, res, urlObj, recordResponse,
            clientIp, deviceId, userId
        })

        let willRunActionList: IActionInfo[] = []
        if (!isWebUiRequest) {
            willRunActionList = this.actionService.getWillRunActionList(userId, deviceId, req.method, urlObj)
        }

        if (context.recordResponse) {
            this.httpTrafficService.requestBegin({
                userId,
                clientIp,
                deviceId,
                id: requestId,
                urlObj,
                method: req.method,
                httpVersion: req.httpVersion,
                headers: req.headers
            });
        }

        try {
            await this._runAtions(context, willRunActionList);
        } catch (err) {
            logger.error('action执行出错', err)
        }

        if (context.recordResponse) {
            context.toClientResponse.requestEndTime = Date.now();
            await this.httpTrafficService.actualRequest({
                id: requestId,
                userId,
                requestData: context.requestRemoteData,
                originBody: context.originRequestContent.body
            });
            await this.httpTrafficService.serverReturn({
                userId,
                id: requestId,
                toClientResponse: context.toClientResponse
            });
        }
    }

    /**
     * 运行规则
     */
    async _runAtions(context: IProcessContext, willRunActionList: IActionInfo[]) {
        // 原始的请求头部
        const {toClientResponse, userId, deviceId, clientIp, res, urlObj} = context

        let requestContent = getDefaultRequestContent()

        let enableHost = this.profileService.enableHost(userId);
        let enableFilter = this.profileService.enableHost(userId);
        let enableRule = this.profileService.enableHost(userId);

        // 记录设备新信息
        toClientResponse.headers['proxy-userId'] = userId;
        toClientResponse.headers['proxy-deviceId'] = deviceId;
        toClientResponse.headers['proxy-clientIp'] = clientIp;
        // 记录状态信息
        toClientResponse.headers['proxy-host-enable'] = enableHost ? "true" : "false";
        toClientResponse.headers['proxy-filter-enable'] = enableFilter ? "true" : "false";
        toClientResponse.headers['proxy-rule-enable'] = enableRule ? "true" : "false";

        let willRunActionListLength = willRunActionList.length;

        // 执行前置动作
        for (let i = 0; i < willRunActionListLength; i++) {
            // 已经向浏览器发送响应，则停止规则处理
            if (toClientResponse.sendedToClient || toClientResponse.stopRunAction) {
                break;
            }
            // 取出将要运行的动作描述信息
            let actionInfo = willRunActionList[i];
            // 对每一个规则 执行action
            let action = actionInfo.action;
            let rule = actionInfo.rule;
            let actionHandler = Action.getAction(action.type);

            // 若action handle不存在，则处理下一个
            if (!actionHandler) {
                toClientResponse.headers[`proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-not_found`);
                continue;
            }
            // 已经有response, 则不运行获取response的action
            if (actionHandler.willGetContent() && toClientResponse.hasContent) {
                toClientResponse.headers[`proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-not_run`);
                continue;
            }
            // 响应头里面记录运行的动作
            toClientResponse.headers[`proxy-action-${i}`] = encodeURI(`${rule.method}-${rule.match}-${action.type}-run`);

            // 动作需要返回内容，但是当前却没有返回内容
            if (actionHandler.needResponse() && !toClientResponse.hasContent) {
                await Action.getBypassAction().run(context, {last: false});
            }
            // 动作需要请求内容，但是当前却没有请求内容
            if (actionHandler.needRequestContent() && !requestContent.hasContent) {
                context.originRequestContent = await requestResponseUtils.getClientRequestContent(
                    req,
                    urlObj);
            }
            // 运行action
            await actionHandler.run(context,
                {
                    rule, // 规则
                    action, // 规则里的一个动作
                    last: i == (willRunActionListLength - 1)
                });
        }

        // 动作运行完还没响应浏览器、则响应浏览器
        if (!toClientResponse.sendedToClient && !res.writableEnded) {
            if (toClientResponse.hasContent) {
                try {
                    sendSpecificToClient({
                        res,
                        statusCode: toClientResponse.statusCode,
                        headers: toClientResponse.headers,
                        content: toClientResponse.body
                    });
                } catch (err) {
                    logger.error(err, urlObj, toClientResponse);
                }
            } else {
                // 自定请求
                toClientResponse.headers['proxy-rule-add'] = 'bypass';
                await Action.getBypassAction().run(context, {last: true});
            }

        }

        return toClientResponse;
    }
}
