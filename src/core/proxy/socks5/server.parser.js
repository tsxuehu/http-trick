const EventEmitter = require('events');

const CMD = require('./constants').CMD;
const ATYP = require('./constants').ATYP;

var STATE_VERSION = 0,
    STATE_NMETHODS = 1,
    STATE_METHODS = 2,
    STATE_REQ_CMD = 3,
    STATE_REQ_RSV = 4,
    STATE_REQ_ATYP = 5,
    STATE_REQ_DSTADDR = 6,
    STATE_REQ_DSTADDR_VARLEN = 7,
    STATE_REQ_DSTPORT = 8;

class Parser extends EventEmitter {
    constructor(stream) {
        super();
        let self = this;

        this._stream = stream;
        this._listening = false;
        // 事件监听直接调用函数，this指针不会指向Parser对象
        this.__onData = function (chunk) {
            self._onData(chunk);
        };

        this._state = STATE_VERSION;
        this._methods = undefined; // 记录方法数目 bytes
        this._methodsp = 0; // 已解析的方法数
        this._cmd = 0;
        this._atyp = 0;
        this._dstaddr = undefined;
        this._dstaddrp = 0;
        this._dstport = undefined;

        let clientIp = stream.remoteAddress;
        if (clientIp.indexOf('::') !== -1) {
            clientIp = clientIp.split(':')[3];
        }
        this._clientIp = clientIp;
        this._clientPort = stream.remotePort;

        this.authed = false;

        this.username = '';
        this.password = '';

        this.start();
    }

    /**
     * 分析接收到的数据块
     * @param chunk
     * @private
     */
    _onData(chunk) {
        let state = this._state;
        let i = 0;
        let len = chunk.length;
        let left;
        let chunkLeft;
        let minLen;

        while (i < len) {
            switch (state) { // 当前解析状态
                /*
                  +----+----------+----------+
                  |VER | NMETHODS | METHODS  |
                  +----+----------+----------+
                  | 1  |    1     | 1 to 255 |
                  +----+----------+----------+
                */
                case STATE_VERSION: // 解析版本号
                    if (chunk[i] !== 0x05) {
                        this.emit('error',
                            new Error('Incompatible SOCKS protocol version: '
                                + chunk[i]));
                        return;
                    }
                    ++i;
                    if (this.authed)
                        state = STATE_REQ_CMD;
                    else
                        state = STATE_NMETHODS;
                    break;
                case STATE_NMETHODS: // 解析支持的认证方法数量
                    let nmethods = chunk[i];
                    if (nmethods === 0) {
                        this.emit('error', new Error('Unexpected empty methods list'));
                        return;
                    }
                    ++i;
                    state = STATE_METHODS;
                    this._methods = new Buffer(nmethods);
                    this._methodsp = 0;
                    break;
                case STATE_METHODS: // 解析支持的方法
                    left = this._methods.length - this._methodsp;
                    chunkLeft = len - i;
                    minLen = (left < chunkLeft ? left : chunkLeft);
                    chunk.copy(this._methods,
                        this._methodsp,
                        i,
                        i + minLen);
                    this._methodsp += minLen;
                    i += minLen;
                    if (this._methodsp === this._methods.length) {
                        this.stop();
                        this._state = STATE_VERSION;
                        if (i < len)
                            this._stream.unshift(chunk.slice(i));
                        let methods = this._methods;
                        this._methods = undefined;
                        this.emit('methods', methods);
                        return;
                    }
                    break;
                // =======================================================================
                /*
                  +----+-----+-------+------+----------+----------+
                  |VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
                  +----+-----+-------+------+----------+----------+
                  | 1  |  1  | X'00' |  1   | Variable |    2     |
                  +----+-----+-------+------+----------+----------+

                  Where:

                        o  VER    protocol version: X'05'
                        o  CMD
                           o  CONNECT X'01'
                           o  BIND X'02'
                           o  UDP ASSOCIATE X'03'
                        o  RSV    RESERVED
                        o  ATYP   address type of following address
                           o  IP V4 address: X'01'
                           o  DOMAINNAME: X'03'
                           o  IP V6 address: X'04'
                        o  DST.ADDR       desired destination address
                        o  DST.PORT desired destination port in network octet
                           order
                */
                case STATE_REQ_CMD: // 请求处理
                    let cmd = chunk[i];
                    if (cmd === CMD.CONNECT)
                        this._cmd = 'connect';
                    else if (cmd === CMD.BIND)
                        this._cmd = 'bind';
                    else if (cmd === CMD.UDP)
                        this._cmd = 'udp';
                    else {
                        this.stop();
                        this.emit('error', new Error('Invalid request command: ' + cmd));
                        return;
                    }
                    ++i;
                    state = STATE_REQ_RSV;
                    break;
                case STATE_REQ_RSV:
                    ++i;
                    state = STATE_REQ_ATYP;
                    break;
                case STATE_REQ_ATYP:
                    let atyp = chunk[i];
                    state = STATE_REQ_DSTADDR;
                    if (atyp === ATYP.IPv4)
                        this._dstaddr = new Buffer(4);
                    else if (atyp === ATYP.IPv6)
                        this._dstaddr = new Buffer(16);
                    else if (atyp === ATYP.NAME)
                        state = STATE_REQ_DSTADDR_VARLEN;
                    else {
                        this.stop();
                        this.emit('error',
                            new Error('Invalid request address type: ' + atyp));
                        return;
                    }
                    this._atyp = atyp;
                    ++i;
                    break;
                case STATE_REQ_DSTADDR:
                    left = this._dstaddr.length - this._dstaddrp;
                    chunkLeft = len - i;
                    minLen = (left < chunkLeft ? left : chunkLeft);
                    chunk.copy(this._dstaddr,
                        this._dstaddrp,
                        i,
                        i + minLen);
                    this._dstaddrp += minLen;
                    i += minLen;
                    if (this._dstaddrp === this._dstaddr.length)
                        state = STATE_REQ_DSTPORT;
                    break;
                case STATE_REQ_DSTADDR_VARLEN:
                    this._dstaddr = new Buffer(chunk[i]);
                    state = STATE_REQ_DSTADDR;
                    ++i;
                    break;
                case STATE_REQ_DSTPORT: // 解析目标端口
                    if (this._dstport === undefined)
                        this._dstport = chunk[i];
                    else {
                        this._dstport <<= 8;
                        this._dstport += chunk[i];
                        ++i;

                        this.stop();
                        if (i < len)
                            this._stream.unshift(chunk.slice(i));

                        if (this._atyp === ATYP.IPv4)
                            this._dstaddr = Array.prototype.join.call(this._dstaddr, '.');
                        else if (this._atyp === ATYP.IPv6) {
                            let ipv6str = '',
                                addr = this._dstaddr;
                            for (let b = 0; b < 16; ++b) {
                                if (b % 2 === 0 && b > 0)
                                    ipv6str += ':';
                                ipv6str += (addr[b] < 16 ? '0' : '') + addr[b].toString(16);
                            }
                            this._dstaddr = ipv6str;
                        } else
                            this._dstaddr = this._dstaddr.toString();

                        this.emit('request', {
                            cmd: this._cmd,
                            srcAddr: this._clientIp,
                            srcPort: this._clientPort,
                            dstAddr: this._dstaddr,
                            dstPort: this._dstport,
                            username: this.username,
                            password: this.password
                        });
                        return;
                    }
                    ++i;
                    break;
                // ===================================================================
            }
        }

        this._state = state;
    };

    start() {
        if (this._listening)
            return;
        this._listening = true;
        this._stream.on('data', this.__onData);
        this._stream.resume();
    };

    stop() {
        if (!this._listening)
            return;
        this._listening = false;
        this._stream.removeListener('data', this.__onData);
        this._stream.pause();
    };

}

module.exports = Parser;
