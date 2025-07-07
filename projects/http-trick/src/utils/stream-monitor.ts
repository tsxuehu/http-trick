import {Transform, TransformCallback, TransformOptions} from 'stream';
import Future from "../lib/concurrent/Future";

export default class StreamMonitor extends Transform {
    private dataBuffer: Buffer[] = []
    private future: Future<Buffer> = new Future()

    constructor(opts?: TransformOptions) {
        super(opts);
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        this.dataBuffer.push(chunk)
        callback(null, chunk)
    }

    async getAllDataAsync(): Promise<Buffer> {
        return await this.future.get()
    }

    getAllDataSync(): Buffer {
        return Buffer.concat(this.dataBuffer)
    }

    _final(callback: (error?: Error | null) => void) {
        let data = Buffer.concat(this.dataBuffer);
        this.future.resolve(data)
        super._final(callback)
    }
}
