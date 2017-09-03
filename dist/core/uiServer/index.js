"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _koaBody = require("koa-body");

var _koaBody2 = _interopRequireDefault(_koaBody);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class UiServer {

    constructor(webUiPort) {
        this.webUiPort = webUiPort;

        // 初始化koa
        this.app = (0, _koa2.default)();
        this.app.use((0, _koaBody2.default)({ multipart: true }));
        this.app.use((0, _koaStatic2.default)(_path2.default.join(__dirname, '../../../static')));
     //   this.app.use((0, _router2.default)());

        // 创建server
        this.server = _http2.default.createServer(this.app.callback());
        this.io = new _socket2.default(this.server);

        // 初始化socket io
      //  this._initStore();
        this._initTraffic();
     //   this._initWsMock();
    }

    start() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // 启动server
            _this.server.listen(_this.webUiPort);
            // web socket
        })();
    }

    _initTraffic() {
        this.httpTraficMonitorNS = this.io.of('/httptrafic');
        this.httpTraficMonitorNS.on('connection', function (client) {
          //  socket.request.Cookie;
            dc.inHttpTraficMonitor();
            client.on('disconnect', function () {
                dc.outHttpTraficMonitor();
            });
        });
    }

    _initStore() {
        this.storeMonitorNS = this.io.of('/store');
    }

    _initWsMock() {
        this.wsmockNS = this.io.of('/wsmock');

        wsmockNS.on('connection', function (debugClient) {
            dc.inWsMockClient();
            // 开启调试会话,返回会话id
            debugClient.on('opensession', function (urlPattern) {
                var sessionId = wsMock.openSession(debugClient.id, urlPattern);
                wsmockNS.emit('assignedsessionid', urlPattern, sessionId);
            });
            debugClient.on('closesession', function (sessionId) {
                wsMock.closeSession(sessionId);
            });
            // mock 界面发回的数据 ， 需要返回给正在mock的页面
            debugClient.on('debuggermsg', function (sessionId, data) {
                wsMock.sendToPageMsg(sessionId, data);
            });
            // 关闭该客户端的所有会话
            debugClient.on('disconnect', function () {
                dc.outWsMockClient();
                wsMock.closeAllSessionInSocket(debugClient.id);
            });
        });
        /* // 页面和proxy建立连接, id为页面对应的调试会话
         wsMock.on('page-connected',function (sessionId) {
             wsmockNS.emit('page-connected',sessionId);
         });
         // 页面发出消息 id为页面对应的调试会话, data为消息内容
         wsMock.on('page-msg',function (sessionId ,data) {
             wsmockNS.emit('page-msg', sessionId, data);
         });
         // 页面关闭 id为页面对应的调试会话
         wsMock.on('page-closed',function (sessionId) {
             wsmockNS.emit('page-closed',sessionId);
         });*/
    }
}

exports.default = UiServer;
new UiServer(8020).start();