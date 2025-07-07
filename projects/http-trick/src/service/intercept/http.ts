import {IncomingMessage, ServerResponse} from "http";
import url from 'url'
import util from 'util'
import {IAction, IRule} from "service/manage/rule";
import cookie from "cookie";
import {cookiesToStr} from "../../utils/cookie-2-str";

/**
 * http请求处理上下文
 */
export interface IProcessContext {
    req: IncomingMessage
    res: ServerResponse
    clientIp: string
    deviceId: string
    userId: string

    recordResponse: boolean //

    originRequestData: IOriginRequestData // 原始请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true

    additionalRequestHeaders: Record<string, string> // 请求头
    additionalRequestQuery: Record<string, string>
    additionalRequestCookies: Record<string, string>// cookie

    actualRequestData: IActualRequestData// 发送请求时使用的数据

    toClientResponse: IToClientResponse
}

export interface ActionRunExtraInfo {
    rule?: IRule
    action?: IAction
    last: boolean
}

export interface IOriginRequestData {
    hasContent: boolean
    href: string
    method: string
    protocol: string
    hostname: string
    path: string
    pathname: string
    port: string
    headers: Record<string, any>
    body?: string
    query: Record<string, string> // query对象
    cookie: Record<string, string>
}

export interface IActualRequestData {
    originHostname?: string
    method?: string
    protocol?: string
    hostname?: string // ip地址
    port?: string
    path?: string
    headers?: Record<string, string>
    body?: string
    timeout?: number
}

export interface IToClientResponse {
    hasContent: boolean// 是否存在要发送给浏览器的内容
    sendedToClient: boolean// 已经向浏览器发送响应内容
    stopRunAction: boolean // 停止运行action
    remoteIp: string// 远程服务器器ip
    receiveRequestTime: number // 接收到请求的时间
    dnsResolveBeginTime: number// dns解析开始时间
    remoteRequestBeginTime: number// 请求开始时间
    remoteResponseStartTime: number// 服务器响应开始时间
    remoteResponseEndTime: number// 服务器响应结束时间
    requestEndTime: number// 响应结束时间
    statusCode: number
    headers: Record<string, string>// 要发送给浏览器的header
    body: string// 要发送给浏览器的body
}


export interface IOptions {
    req: IncomingMessage
    res: ServerResponse
    href: string
    clientIp: string
    deviceId: string
    userId: string
}

export function getDefaultProcessContext(options: IOptions): IProcessContext {
    const {req, href} = options;
    const urlObj = new URL(href);
    // 额外发送的头部
    let additionalRequestHeaders = {};
    // 额外发送的query
    let additionalRequestQuery = {};
    // 额外发送的cookie
    let additionalRequestCookies = {};
    const originRequestContent: IOriginRequestData = {
        href,
        hasContent: false,
        method: req.method,
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        path: `${urlObj.pathname}${urlObj.search}`,// 需要计算
        port: urlObj.port ? urlObj.port : (urlObj.protocol === "https:" ? '443' : '80'),
        headers: {...req.headers},
        // 计算得到的
        pathname: urlObj.pathname,
        query: {}, // query对象
        cookie: {},
    }
    const requestRemoteData: IActualRequestData = {};// 发送远端请求时使用的数据

    // 初始化 originRequestContent
    const params = new URLSearchParams(urlObj.search)
    for (const [key, value] of params.entries()) {
        originRequestContent.query[key] = value;
    }
    const originCookies = cookie.parse(req.headers.cookie || "");
    Object.assign(originRequestContent.cookie, originCookies, additionalRequestCookies);

    const toClientResponse: IToClientResponse = {
        hasContent: false,// 是否存在要发送给浏览器的内容
        sendedToClient: false, // 已经向浏览器发送响应内容
        stopRunAction: false, // 停止运行action
        remoteIp: '',// 远程服务器器ip
        receiveRequestTime: Date.now(), // 接收到请求的时间
        dnsResolveBeginTime: 0,// dns解析开始时间
        remoteRequestBeginTime: 0,// 请求开始时间
        remoteResponseStartTime: 0,// 服务器响应开始时间
        remoteResponseEndTime: 0,// 服务器响应结束时间
        requestEndTime: 0,// 响应结束时间
        statusCode: 200,
        headers: {},// 要发送给浏览器的header
        body: ''// 要发送给浏览器的body
    }

    return {
        req: options.req,
        res: options.res,
        recordResponse: false,
        clientIp: options.clientIp,
        deviceId: options.deviceId,
        userId: options.userId,

        originRequestData: originRequestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
        additionalRequestHeaders, // 请求头
        additionalRequestQuery,
        additionalRequestCookies, // cookie
        actualRequestData: requestRemoteData,
        toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
    }
}

export function generateHeadersInActualRequestData(context: IProcessContext) {
    const {
        originRequestData,
        additionalRequestCookies,
        additionalRequestHeaders,
        actualRequestData
    } = context;
    // 生成header
    actualRequestData.headers = {}
    Object.assign(actualRequestData.headers, originRequestData.headers);
    Object.assign(actualRequestData.headers, additionalRequestHeaders);
    // 处理cookie
    if (Object.entries(additionalRequestCookies).length > 0) {
        const cookieObj = {}
        Object.assign(cookieObj, originRequestData.cookie);
        Object.assign(cookieObj, additionalRequestCookies);
        actualRequestData.headers.cookie = cookiesToStr(cookieObj);
    } else {
        actualRequestData.headers.cookie = originRequestData.headers.cookie || "";
    }
}

export function getTargetUrl(context: IProcessContext): string {
    const {protocol, originHostname, port, path} = context.actualRequestData
    return protocol + '//' + originHostname + (port ? ':' + port : '') + path
}

export function setError(toClientResponse: IToClientResponse, msg: string = "", error?: Error) {
    toClientResponse.statusCode = 600;
    toClientResponse.hasContent = true;
    toClientResponse.stopRunAction = true;
    // pipe类型的响应 sendedToClient为true
    toClientResponse.sendedToClient = false;
    toClientResponse.body = msg + "\n\n" + util.inspect(toClientResponse.headers) + "\n\n" + (error && error.message || "") + "\n\n" + error && util.inspect(error);
};
