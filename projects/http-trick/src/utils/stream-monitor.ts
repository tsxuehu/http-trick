import {Transform, TransformCallback, TransformOptions} from 'stream';
import Future from "../lib/concurrent/Future";

export default class StreamMonitor extends Transform {
    private dataBuffers: Buffer[] = []
    private future: Future<Buffer> = new Future()

    constructor(opts?: TransformOptions) {
        super(opts);
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        this.dataBuffers.push(chunk)
        callback(null, chunk)
    }

    async getAllDataAsync(): Promise<Buffer> {
        return await this.future.get()
    }

    getAllDataSync(): Buffer {
        return Buffer.concat(this.dataBuffers)
    }

    _final(callback: (error?: Error | null) => void) {
        let data = Buffer.concat(this.dataBuffers);
        this.future.resolve(data)
        super._final(callback)
    }
}
