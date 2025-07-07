import {Service} from "di/annotation";
import {IActualRequestData, IToClientResponse} from "service/intercept/http";
import {IProxyConfig} from "service/manage/profile";
import {IncomingMessage, ServerResponse} from "http";
import http from "http"
import https from "https"
import Future from "../../lib/concurrent/Future";
import StreamMonitor from "../../utils/stream-monitor";
import stream from 'stream'
import zlib from 'zlib'

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

@Service()
export default class RemoteContentService {

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    async pipe(param: IPipeParam) {
        const {req, res, recordResponse, toClientResponse, actualRequestData, proxyInfo} = param;
        toClientResponse.remoteRequestBeginTime = Date.now();

        const {
            reqStreamPromise,
            reqMonitor,
            remoteRes
        } = await this._request(req, recordResponse, toClientResponse, proxyInfo)

        toClientResponse.remoteResponseStartTime = Date.now();

        await reqStreamPromise;

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
            await Promise.all([reqStreamPromise, resStreamPromise]);

            toClientResponse.remoteResponseEndTime = Date.now();
            toClientResponse.hasContent = true;
            const resBuffer = resMonitor.getAllDataSync()
            toClientResponse.body = '' // 解压
            actualRequestData.body = '' //
        }
    }

    /**
     * 将请求远程的响应内容
     */
    async cache(param: ICacheParam) {
        const {req, recordResponse, toClientResponse, actualRequestData, proxyInfo} = param;


        toClientResponse.remoteRequestBeginTime = Date.now();

        const {
            reqStreamPromise,
            reqMonitor,
            remoteRes
        } = await this._request(req, recordResponse, toClientResponse, proxyInfo)

        toClientResponse.remoteResponseStartTime = Date.now();

        toClientResponse.statusCode = remoteRes.statusCode;
        Object.assign(toClientResponse.headers, remoteRes.headers)
        delete toClientResponse.headers['content-length'];
        delete toClientResponse.headers['content-encoding'];
        delete toClientResponse.headers['transfer-encoding'];
        // 获取返回流数据
        const contentEncoding = toClientResponse.headers["content-encoding"]
        toClientResponse.body = '' // 解压
        toClientResponse.hasContent = true;
        toClientResponse.remoteResponseEndTime = Date.now();

        if (recordResponse && !actualRequestData.body) {
            const reqBuffer = reqMonitor.getAllDataSync()
            actualRequestData.body = reqBuffer.toString()
        }
    }

    private async _request(req: IncomingMessage,
                           recordResponse: boolean,
                           actualRequestData: IActualRequestData, proxyInfo: IProxyConfig): Promise<{
        reqStreamPromise: Promise<void>
        reqMonitor: StreamMonitor
        remoteRes: IncomingMessage
    }> {
        const requestFuture = new Future<IncomingMessage>();
        const client = actualRequestData.protocol === 'https:' ? https : http;
        const remoteReq = client.request({
            method: actualRequestData.method,
            port: actualRequestData.port,
            path: actualRequestData.path,
            hostname: actualRequestData.hostname,
            headers: actualRequestData.headers,
            timeout: actualRequestData.timeout,
            rejectUnauthorized: false,
            setHost: false,
            agent: undefined
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

        return {
            reqStreamPromise,
            reqMonitor,
            remoteRes,
        }
    }

    // res.headers["content-encoding"]
    private async _unCompress(buf: Buffer, contentEncoding: string): Promise<string> {
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
}
