import {IncomingMessage, ServerResponse} from "http";
import url from 'url'
import {IAction, IRule} from "service/manage/rule";

/**
 * http请求处理上下文
 */
export interface IProcessContext {
    req: IncomingMessage
    res: ServerResponse
    recordResponse: boolean //
    urlObj: url.URL
    clientIp: string
    deviceId: string
    userId: string

    originRequestContent: IOriginRequestData // 原始请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
    additionalRequestHeaders: Record<string, string> // 请求头
    actualRequestHeaders: Record<string, string>
    additionalRequestQuery: Record<string, string>
    actualRequestQuery: Record<string, string>
    additionalRequestCookies: Record<string, string>// cookie
    actualRequestCookies: Record<string, string>

    requestRemoteData: IRequestRemoteData// 发送请求时使用的数据

    toClientResponse: IToClientResponse
}

export interface ActionRunExtraContext {
    rule: IRule
    action: IAction
    last: boolean
}

export interface IOriginRequestData {
    hasContent: false,
    method: '',
    protocol: '',
    hostname: '',
    path: '',
    query: {}, // query对象
    port: '',
    headers: {},
    body: ''
}

export interface IToClientResponse {
    hasContent: boolean// 是否存在要发送给浏览器的内容
    sendedToClient: boolean// 已经向浏览器发送响应内容
    stopRunAction: boolean // 停止运行action
    remoteIp: ''// 远程服务器器ip
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

export interface IRequestRemoteData {
    method: ''
    protocol: ''
    port: ''
    path: ''
    headers: {}
    body: ''
}

export function getDefaultRequestContent(): IOriginRequestData {
    return {
        hasContent: false,
        method: '',
        protocol: '',
        hostname: '',
        path: '',
        query: {}, // query对象
        port: '',
        headers: {},
        body: ''
    }
}

export interface IOptions {
    req: IncomingMessage
    res: ServerResponse
    recordResponse: boolean //
    urlObj: url.URL
    clientIp: string
    deviceId: string
    userId: string
}

export function getDefaultProcessContext(options: IOptions): IProcessContext {
    // 额外发送的头部
    let additionalRequestHeaders = {};
    let actualRequestHeaders = {}; // 实际发出的请求的header
    // 额外发送的query
    let additionalRequestQuery = {};
    let actualRequestQuery = {}; // 实际发出的请求的query
    // 额外发送的cookie
    let additionalRequestCookies = {};
    let actualRequestCookies = {}; // 实际发出的请求的cookies
    const originRequestContent: IOriginRequestData = {
        hasContent: false,
        method: '',
        protocol: '',
        hostname: '',
        path: '',
        query: {}, // query对象
        port: '',
        headers: {},
        body: ''
    }
    const requestRemoteData: IRequestRemoteData = {// 发送远端请求时使用的数据
        method: '',
        protocol: '',
        port: '',
        path: '',
        headers: {},
        body: ''
    };
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
        recordResponse: options.recordResponse,
        urlObj: options.urlObj,
        clientIp: options.clientIp,
        deviceId: options.deviceId,
        userId: options.userId,

        originRequestContent, // 请求内容 , 动作使用这个参数 需要让needRequestContent函数返回true
        additionalRequestHeaders, // 请求头
        actualRequestHeaders,
        additionalRequestQuery,
        actualRequestQuery,
        additionalRequestCookies, // cookie
        actualRequestCookies,
        requestRemoteData,
        toClientResponse, //响应内容,  动作使用这个参数 需要让needResponse函数返回true
    }
}

export function parseUrl(req: IncomingMessage): url.URL {
    let host = req.headers.host;
    let protocol = '';
    if (!req.socket.encrypted) {
        // http协议接收到请求,如果没有指明使用https协议代理访问则使用http
        if (/^https:/.test(req.url)) {
            protocol = "https";
        } else {
            protocol = "http";
        }
    } else {
        // https协议接收到请求,如果没有指明使用http协议代理访问则使用https
        if (!/^http:/.test(req.url)) {
            protocol = "https";
        } else {
            protocol = "http";
        }
    }
    let fullUrl = "";
    // 没有指明详细的url，则拼接url
    if (req.url.startsWith('http')) {
        fullUrl = req.url;
    } else {
        fullUrl = protocol + '://' + host + req.url;
    }

    let urlObj = new URL(fullUrl);
    urlObj.port = urlObj.port || (protocol == 'https' ? '443' : '80');

    return urlObj;
}
