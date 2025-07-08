import {Service} from "di/annotation";
import forEach from "lodash/forEach";
import Future from "../../lib/concurrent/Future";
import {IncomingMessage, ServerResponse} from "http";

@Service()
export class ClientService {
    sendSpecificToClient({res, statusCode, headers, content}: {
        res: ServerResponse; statusCode: number; headers: Record<string, any>; content: string | Buffer;
    }) {
        if (res.writableEnded) return;
        res.statusCode = statusCode || 200;

        let buffer = null;
        if (Buffer.isBuffer(content)) {
            buffer = content;
        } else {
            buffer = Buffer.from(content, 'utf-8');
        }

        if (!res.headersSent) {
            headers['content-length'] = buffer.length;
            forEach(headers, function (value, key) {
                res.setHeader(key, value);
            });
        }

        res.end(buffer);
    };


    async getClientRequestBody(req: IncomingMessage): Promise<string> {
        const future = new Future<string>()

        let method = req.method.toLowerCase();
        if (["post", "put", "patch"].indexOf(method) > -1) {
            let readStream = req;

            const future = new Future()
            let data = ''
            readStream.on('data', (chunk) => {
                data += chunk
            })

            readStream.on('end', () => {
                future.resolve()
            })
            readStream.on('error', (err) => {
                future.reject(err)
            })
            await future.get()
            return data
        } else {
            future.resolve("");
        }
        return await future.get()
    }
}
