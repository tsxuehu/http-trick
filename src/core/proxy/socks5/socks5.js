const net = require('net');
const util = require('util');
const EventEmitter = require('events');
const http = require('http')

const Parser = require('./server.parser');
const ipbytes = require('./utils').ipbytes;

const HttpHandle = require("../http/handle/httpHandle");

const ServiceRegistry = require("../../service");
const NoneAuth = require("./auth/None");
const UserPassword = require("./auth/UserPassword");

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

// 记录连接http代理的端口的用户
let transferClientPortUserReqMap = {};

/**
 *  forward TCP connection to a new HTTP req/res
 */
module.exports.Server = class Server extends EventEmitter {
    constructor({
                    socks5Port,
                    httpPort,
                    httpsPort
                }) {
        super();
        this.httpHandle = HttpHandle.getInstance();

        this.socks5Port = socks5Port;
        this.httpPort = httpPort;
        this.httpsPort = httpsPort;
        this._connections = 0;
        this.maxConnections = 1000;
        this._authMap = {};
        this.hostService = ServiceRegistry.getHostService();
        this.profileService = ServiceRegistry.getProfileService();

        this.httpServer = http.createServer();
        this.httpServer.on('request', (req, res) => {
            this.httpHandle.handle(req, res).catch(e => {
                console.error(e);
            });

        });
        this.httpServer.on('error', function (err) {
            console.log(err);
        });

        let self = this;

        // 创建socket
        this._srv = new net.Server(function (socket) {
            if (self._connections >= self.maxConnections) { // 超过最大连接数拒绝连接
                socket.destroy();
                return;
            }
            ++self._connections;
            socket.once('close', function (had_err) {
                --self._connections;
            });
            // 处理请求链接
            self._handleSocks5Connection(socket);
        }).on('error', function (err) {
            self.emit('error', err);
        }).on('listening', function () {
            console.log('socks5 listening')
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
    _handleSocks5Connection(socket) {
        let self = this;
        let parser = new Parser(socket);
        parser.on('error', function (err) {
            console.log(err)
            if (socket.writable)
                socket.end();
        });
        parser.on('methods', function (methods) { // 验证
            let authsMap = self._authMap;
            let auth = null;
            for (let i = 0; i < methods.length; i++) {
                let method = methods[i];
                auth = authsMap[method];
                if (auth) break;
            }
            if (auth) {
                auth.server(socket, function (result, user, pass) {
                    if (result === true) {
                        parser.authed = true;
                        parser.username = user;
                        parser.password = pass;
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
        parser.on('request', function (reqInfo) { // 请求数据
            if (reqInfo.cmd !== 'connect')
                return socket.end(BUF_REP_CMDUNSUPP);
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
            let username = req.username;
            let userId = this.profileService.getUserIdByUserName(username);
            // 请求socket
            if (req.dstPort == 80) {
                http._connectionListener.call(this.httpServer, socket);
                /* socket.on('data', data => {
                     console.log(data)
                 })*/
                socket.resume();
                let localbytes = ipbytes('127.0.0.1'),
                    len = localbytes.length,
                    bufrep = new Buffer(6 + len),
                    p = 4;
                bufrep[0] = 0x05;
                bufrep[1] = REP.SUCCESS;
                bufrep[2] = 0x00;
                bufrep[3] = (len === 4 ? ATYP.IPv4 : ATYP.IPv6);
                for (let i = 0; i < len; ++i, ++p)
                    bufrep[p] = localbytes[i];
                bufrep.writeUInt16BE(80, p, true);

                socket.write(bufrep);
                return;
            }

            if (req.dstPort == 443) {
                // tls


                socket.resume();
                let localbytes = ipbytes('127.0.0.1'),
                    len = localbytes.length,
                    bufrep = new Buffer(6 + len),
                    p = 4;
                bufrep[0] = 0x05;
                bufrep[1] = REP.SUCCESS;
                bufrep[2] = 0x00;
                bufrep[3] = (len === 4 ? ATYP.IPv4 : ATYP.IPv6);
                for (let i = 0; i < len; ++i, ++p)
                    bufrep[p] = localbytes[i];
                bufrep.writeUInt16BE(80, p, true);

                socket.write(bufrep);
                return;
            }

            let targetIp;
            let targetPort = req.dstPort;

            req.userId = userId;
            if (targetPort == 443) {
                targetIp = '127.0.0.1';
                targetPort = this.httpsPort;
            } else if (targetPort == 80) {
                targetIp = '127.0.0.1';
                targetPort = this.httpPort;
            } else {
                let ip = await this.hostService.resolveHost(userId, req.dstAddr);
                let targetIp = ip;
            }


            let dstSock = new net.Socket();
            let transferClientPort = '';
            let connected = false;
            dstSock.setKeepAlive(false);
            dstSock.on('error', (err) => {
                if (!connected)
                    handleProxyError(socket, err);
            });
            dstSock.on('close', had_error => {
                delete transferClientPortUserReqMap[transferClientPort];
            })
            dstSock.on('connect', function () {
                let {port} = dstSock.address();
                transferClientPort = port;
                transferClientPortUserReqMap[transferClientPort] = req;
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
                        // 调用http模块里的东西进行处理


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

        this.useAuth(new UserPassword());
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

module.exports.getTranserPortInfo = function (port) {
    return transferClientPortUserReqMap[port]
}


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
