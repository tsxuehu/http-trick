const net = require('net');
const util = require('util');
const EventEmitter = require('events');
const Parser = require('./server.parser');
const ipbytes = require('./utils').ipbytes;

const ServiceRegistry = require("../../service");
const NoneAuth = require("./auth/None");

const ATYP = require('./constants').ATYP;
const CMD = require('./constants').CMD;
const REP = require('./constants').REP;

// -------------- 常量 --------------
// 没有支持的认证
const BUF_AUTH_NO_ACCEPT = new Buffer([0x05, 0xFF]);

const BUF_REP_INTR_SUCCESS = new Buffer([0x05,
    REP.SUCCESS,
    0x00,
    0x01,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00]);

const BUF_REP_DISALLOW = new Buffer([0x05, REP.DISALLOW]);
// 命令不支持
const BUF_REP_CMDUNSUPP = new Buffer([0x05, REP.CMDUNSUPP]);

module.exports = class Server extends EventEmitter {
    constructor({
                    socks5Port,
                    httpPort,
                    httpsPort
                }) {
        super();
        this.socks5Port = socks5Port;
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
        this._connections = 0;
        this.maxConnections = Infinity;
        this._authMap = {};
        this.hostService = ServiceRegistry.getHostService();
        this.profileService = ServiceRegistry.getProfileService();

        let self = this;

        // 创建socket
        this._srv = new net.Server(function (socket) {
            if (self._connections >= self.maxConnections) {
                socket.destroy();
                return;
            }
            ++self._connections;
            socket.once('close', function (had_err) {
                --self._connections;
            });
            // 处理请求链接
            self._onConnection(socket);
        }).on('error', function (err) {
            self.emit('error', err);
        }).on('listening', function () {
            console.log('listening')
            self.emit('listening');
        }).on('close', function () {
            self.emit('close');
        });

    }

    /**
     * 处理socket链接
     * @param socket
     * @private
     */
    _onConnection(socket) {
        let self = this;
        let parser = new Parser(socket);
        parser.on('error', function (err) {
            if (socket.writable)
                socket.end();
        });
        parser.on('methods', function (methods) {
            let authsMap = self._authMap;
            let auth = null;
            for(let i = 0;i< methods.length;i++){
                let method = methods[i];
                auth = authsMap[method];
                if (auth) break;
            }
            if (auth) {
                auth.server(socket, function (result) {
                    if (result === true) {
                        parser.authed = true;
                        parser.start();
                    } else {
                        if (util.isError(result)) {

                        }
                        socket.end();
                    }
                });
                socket.write(new Buffer([0x05, auth.METHOD]));
                socket.resume();
            } else {
                socket.end(BUF_AUTH_NO_ACCEPT);
            }
        });
        parser.on('request', function (reqInfo) {
            if (reqInfo.cmd !== 'connect')
                return socket.end(BUF_REP_CMDUNSUPP);

            reqInfo.srcAddr = socket.remoteAddress;
            reqInfo.srcPort = socket.remotePort;

            // socket.write(BUF_REP_INTR_SUCCESS) ？？
            // 拒绝代理  socket.end(BUF_REP_DISALLOW);
            self.proxySocket(socket, reqInfo);
        });

        function onClose() {
            if (socket.dstSock && socket.dstSock.writable)
                socket.dstSock.end();
            socket.dstSock = undefined;
        }

        // 为客户端连接绑定事件
        socket.on('error', onErrorNoop);
        socket.on('end', onClose);
        socket.on('close', onClose);
    }

    /**
     * 代理socket请求
     * @param socket
     * @param req
     */
    async proxySocket(socket, req) {
        // 如何判别通信的协议
        // 比较简洁的方法通过端口号判断--不准确
        // 理想情况通过首个数据包判断
        try {
            let dstSock = new net.Socket();
            let connected = false;

            let targetIp ;
            let targetPort = req.dstPort;
            if (targetPort == 443) {
                targetIp = '127.0.0.1';
                targetPort = this.httpsPort;
            } else if (targetPort == 80) {
                targetPort = this.httpPort;
            } else {
                let clientIp = socket.remoteAddress;
                let userId = this.profileService.getClientIpMappedUserId(clientIp);
                let ip = await this.hostService.resolveHost(userId, req.dstAddr);
                let targetIp = ip;
            }

            dstSock.setKeepAlive(false);
            dstSock.on('error', (err) => {
                if (!connected)
                    handleProxyError(socket, err);
            });
            dstSock.on('connect', function () {
                connected = true;
                if (socket.writable) {
                    let localbytes = ipbytes(dstSock.localAddress || '127.0.0.1'),
                        len = localbytes.length,
                        bufrep = new Buffer(6 + len),
                        p = 4;
                    bufrep[0] = 0x05;
                    bufrep[1] = REP.SUCCESS;
                    bufrep[2] = 0x00;
                    bufrep[3] = (len === 4 ? ATYP.IPv4 : ATYP.IPv6);
                    for (let i = 0; i < len; ++i, ++p)
                        bufrep[p] = localbytes[i];
                    bufrep.writeUInt16BE(dstSock.localPort, p, true);

                    socket.write(bufrep);

                    if (req.dstPort == 80) {
                        socket.pipe(dstSock).pipe(socket);
                        /* socket.on('data', d => {
                             console.log(d.toString('utf-8'));
                         });
                         socket.end(`HTTP/1.1 200 OK

 aa`);*/
                    } /*else if (req.dstPort == 443) { // 如何识别握手包
                       /!* socket.on('data', d => {
                            console.log(d.toString('hex'));
                            socket.destroy();
                        });*!/
                        let tlsSocket = new tls.TLSSocket(socket, {
                            isServer: true,
                            SNICallback(serverName, SNICallback) {
                                console.log(serverName)
                            }
                        })
                        tlsSocket.renegotiate({},err=>{
                            console.log('xieshang')
                        })
                    }*/ else {
                        socket.pipe(dstSock).pipe(socket);
                    }

                    socket.resume();
                } else if (dstSock.writable)
                    dstSock.end();
            });
            dstSock.connect(targetPort, targetIp);
            socket.dstSock = dstSock;

        } catch (err) {
            handleProxyError(socket, err);
        }
    }

    useAuth(auth) {
        this._authMap[auth.METHOD] = auth;
        return this;
    }

    start() {
        this.useAuth(new NoneAuth());
        this._srv.listen(this.socks5Port);
        return this;
    }

    address() {
        return this._srv.address();
    }

    getConnections(cb) {
        this._srv.getConnections(cb);
    }

    close(cb) {
        this._srv.close(cb);
        return this;
    }
};

function onErrorNoop(err) {
}

function handleProxyError(socket, err) {
    if (socket.writable) {
        var errbuf = new Buffer([0x05, REP.GENFAIL]);
        if (err.code) {
            switch (err.code) {
                case 'ENOENT':
                case 'ENOTFOUND':
                case 'ETIMEDOUT':
                case 'EHOSTUNREACH':
                    errbuf[1] = REP.HOSTUNREACH;
                    break;
                case 'ENETUNREACH':
                    errbuf[1] = REP.NETUNREACH;
                    break;
                case 'ECONNREFUSED':
                    errbuf[1] = REP.CONNREFUSED;
                    break;
            }
        }
        socket.end(errbuf);
    }
}
