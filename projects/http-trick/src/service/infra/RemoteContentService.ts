import {Service} from "@spring4js/container-node";
import {IActualRequestData, IToClientResponse} from "service/intercept/http";
import {IProxyConfig} from "service/manage/profile";
import {IncomingMessage, ServerResponse} from "http";
import http from "http"
import https from "https"
import Future from "../../lib/concurrent/Future";
import StreamMonitor from "../../utils/stream-monitor";
import stream from 'stream'
import zlib from 'zlib'
import {SocksProxyAgent} from 'socks-proxy-agent'
import {HttpProxyAgent} from 'http-proxy-agent'
import {HttpsProxyAgent} from 'https-proxy-agent'
import {filterEmptyValues} from "../../utils/obj";

export interface IPipeParam {
    req: IncomingMessage
    res: ServerResponse
    recordResponse: boolean
    actualRequestData: IActualRequestData
    toClientResponse: IToClientResponse
    proxyInfo: IProxyConfig
}

export interface ICacheParam {
    req: IncomingMessage
    recordResponse: boolean
    actualRequestData: IActualRequestData
    toClientResponse: IToClientResponse
    proxyInfo: IProxyConfig
}

export interface IRequestParam {
    req: IncomingMessage
    recordResponse: boolean
    actualRequestData: IActualRequestData
    toClientResponse: IToClientResponse
    proxyInfo: IProxyConfig
}

@Service()
export default class RemoteContentService {

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    async pipe(param: IPipeParam) {
        const {res, recordResponse, toClientResponse} = param;

        const remoteRes = await this._request(param)

        toClientResponse.statusCode = remoteRes.statusCode;
        Object.assign(toClientResponse.headers, remoteRes.headers)
        res.writeHead(remoteRes.statusCode, toClientResponse.headers);

        let resStreamPromise: Promise<void>
        const resMonitor = new StreamMonitor()
        if (recordResponse) {
            resStreamPromise = stream.promises.pipeline([remoteRes, resMonitor, res])
        } else {
            resStreamPromise = stream.promises.pipeline([remoteRes, res])
        }
        toClientResponse.sendedToClient = true;

        if (recordResponse) {
            await resStreamPromise;

            toClientResponse.remoteResponseEndTime = Date.now();
            toClientResponse.hasContent = true;
            const contentEncoding = toClientResponse.headers["content-encoding"];
            const resBuffer = resMonitor.getAllDataSync();
            toClientResponse.body = await unCompressBuffer(resBuffer, contentEncoding);
        }
    }

    /**
     * 将请求远程的响应内容
     */
    async cache(param: ICacheParam) {
        const {toClientResponse} = param;

        const remoteRes = await this._request(param)

        toClientResponse.statusCode = remoteRes.statusCode;
        Object.assign(toClientResponse.headers, remoteRes.headers)
        delete toClientResponse.headers['content-length'];
        delete toClientResponse.headers['content-encoding'];
        delete toClientResponse.headers['transfer-encoding'];
        // 获取返回流数据
        const contentEncoding = toClientResponse.headers["content-encoding"];
        const resBuffer = await getAllContentFromStream(remoteRes);
        toClientResponse.body = await unCompressBuffer(resBuffer, contentEncoding);
        toClientResponse.hasContent = true;
        toClientResponse.remoteResponseEndTime = Date.now();
    }

    private async _request(param: IRequestParam): Promise<IncomingMessage> {
        const {req, recordResponse, toClientResponse, actualRequestData, proxyInfo} = param;

        toClientResponse.remoteRequestBeginTime = Date.now();


        const requestFuture = new Future<IncomingMessage>();
        const isHttps = actualRequestData.protocol === 'https:'
        const client = isHttps ? https : http;
        let agent: http.Agent
        if (proxyInfo.hasExternalProxy) {
            if (proxyInfo.proxyType === 'socks5') {
                const proxyUrl = `socks://${proxyInfo.proxyIp}:${proxyInfo.proxyPort}`
                agent = new SocksProxyAgent(proxyUrl) as http.Agent
            } else if (proxyInfo.proxyType === 'http') {
                const proxyUrl = `http://${proxyInfo.proxyIp}:${proxyInfo.proxyPort}`
                if (isHttps) {
                    agent =  new HttpsProxyAgent(proxyUrl) as http.Agent
                } else {
                    agent =  new HttpProxyAgent(proxyUrl) as http.Agent
                }
            }
        }
        const remoteReq = client.request({
            method: actualRequestData.method,
            port: actualRequestData.port,
            path: actualRequestData.path,
            hostname: actualRequestData.hostname,
            headers: filterEmptyValues(actualRequestData.headers),
            timeout: actualRequestData.timeout,
            rejectUnauthorized: false,
            setHost: false,
            agent
        }, res => {
            requestFuture.resolve(res)
        });
        remoteReq.on('error', (err) => {
            requestFuture.reject(err);
        });
        remoteReq.on('timeout', () => {
            requestFuture.reject(new Error(`timeout ${actualRequestData.originHostname}`));
            remoteReq.destroy();
        });
        const reqMonitor = new StreamMonitor()
        let reqStreamPromise: Promise<void>
        if (actualRequestData.body) {
            remoteReq.end(actualRequestData.body);
        } else {
            if (recordResponse) {
                reqStreamPromise = stream.promises.pipeline([req, reqMonitor, remoteReq])
            } else {
                reqStreamPromise = stream.promises.pipeline([req, remoteReq])
            }
        }
        const remoteRes = await requestFuture.get();

        toClientResponse.remoteResponseStartTime = Date.now();


        await reqStreamPromise;

        if (recordResponse) {
            if (!actualRequestData.body) {
                const reqBuffer = reqMonitor.getAllDataSync()
                actualRequestData.body = reqBuffer.toString()
            }
            // TODO 通知monitor 请求body
        }
        return remoteRes
    }
}

export async function getAllContentFromStream(readStream: stream.Readable): Promise<Buffer> {
    const future = new Future()
    const dataBuffers: Buffer[] = []
    readStream.on('data', (chunk) => {
        dataBuffers.push(chunk)
    })

    readStream.on('end', () => {
        future.resolve()
    })
    readStream.on('error', (err) => {
        future.reject(err)
    })
    await future.get()
    return Buffer.concat(dataBuffers)
}

async function unCompressBuffer(buf: Buffer, contentEncoding: string): Promise<string> {
    const future = new Future<string>()
    const unCompressCb = (err: Error, decompressedBuffer: Buffer) => {
        if (err) {
            future.reject(err);
            return;
        }
        future.resolve(decompressedBuffer.toString())
    }
    switch (contentEncoding) {
        case "gzip":
            zlib.gunzip(buf, unCompressCb);
            break;
        case "deflate":
            zlib.inflate(buf, unCompressCb);
            break;
        case "br":
            zlib.brotliDecompress(buf, unCompressCb);
            break;
        default:
            future.resolve(buf.toString());
    }
    return await future.get();
}
