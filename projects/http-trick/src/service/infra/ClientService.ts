import {Service} from "di/annotation";
import forEach from "lodash/forEach";
import Future from "../../lib/concurrent/Future";
import {IncomingMessage} from "http";

@Service()
export class ClientService {
    sendSpecificToClient({res, statusCode, headers, content}) {
        if (res.finished) return;
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


        if (req.future) {
            return await req.future.get();
        }

        const future = new Future<string>()


        let method = req.method.toLowerCase();
        if (["post", "put", "patch"].indexOf(method) > -1) {
            let stream = req;

            let requestBuffer = [];
            stream.on("data", function handleStreamData(chunk) {
                requestBuffer.push(chunk);
            });

            stream.on("error", function handleStreamError(err) {
                future.reject(err);
            });

            stream.on("end", function handleStreamEnd() {
                let requestData = Buffer.concat(requestBuffer);
                future.resolve(requestData);
            });
        } else {
            future.resolve("");
        }

        req.future = future;
        return await future.get()
    }
}
