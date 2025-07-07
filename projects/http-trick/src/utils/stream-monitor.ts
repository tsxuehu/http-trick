import {Transform, TransformCallback, TransformOptions} from 'stream';
import Future from "../lib/concurrent/Future";

module.exports = class StreamMonitor extends Transform {
    private dataBuffer: Buffer[] = []
    private future: Future<Buffer> = new Future()

    constructor(opts?: TransformOptions) {
        super(opts);
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        this.dataBuffer.push(chunk)
        callback(null, chunk)
    }

    async getAllDataAsync() {
        return await this.future.get()
    }

    _final(callback: (error?: Error | null) => void) {
        let data = Buffer.concat(this.dataBuffer);
        this.future.resolve(data)
        super._final(callback)
    }
}
