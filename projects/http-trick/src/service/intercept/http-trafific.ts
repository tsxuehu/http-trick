import {IActualRequestData, IOriginRequestData, IToClientResponse} from "service/intercept/http";

export interface IFilter {
    host: string
    path: string
}

export interface IStatus {
    stopRecord: boolean
    overflow: boolean
}

export interface IRequestBeginInfo {
    id: number
    userId: string
    clientIp: string
    deviceId: string
    method: string
    httpVersion: string
    originRequestData: IOriginRequestData,
}

export interface IActualRequestInfo {
    id: number
    userId: string
    requestData: IActualRequestData
    originBody: string
}

export interface IServerReturnInfo {
    userId: string
    id: number
    toClientResponse: IToClientResponse
}
