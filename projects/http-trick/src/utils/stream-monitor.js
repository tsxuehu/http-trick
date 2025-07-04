const { resolve } = require('path');
const { Transform } = require('stream');

module.exports = class StreamMonitor extends Transform {
  constructor(options) {
    super(options);
    this.dataBuffer = []
    
    this.finishPromise = new Promise((resolve)=> {
        this.finishPromoseResolve = resolve
    })
  }

  _transform(chunk, encoding, callback) {
    this.dataBuffer.push(chunk)
    callback(null, chunk)
  }

  async getAllDataAsync() {
    const data = await this.finishPromise
    return data
  }

  _final(callback) {
    let data = Buffer.concat(this.dataBuffer);
    this.finishPromoseResolve(data)
    super._final(callback)
  }
}