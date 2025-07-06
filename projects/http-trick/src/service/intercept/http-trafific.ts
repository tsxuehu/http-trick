import {IRequestRemoteData} from "service/intercept/http";

export interface IFilter {
    host: string
    path: string
}
export interface IStatus {
    stopRecord: boolean
    overflow: boolean
}
export interface IRequestBeginInfo {
    id, userId, clientIp, deviceId, method, httpVersion, urlObj, headers
}
export interface IActualRequestInfo {
    id: number
    userId: string
    requestData: IRequestRemoteData
    originBody: string
}

export interface IServerReturnInfo {
    userId, id,
    toClientResponse: IToClientResponse
}
export interface IToClientResponse {
    statusCode,
    headers,
    receiveRequestTime,
    dnsResolveBeginTime,
    remoteRequestBeginTime,
    remoteResponseStartTime,
    remoteResponseEndTime,
    requestEndTime,
    remoteIp,
    body
}