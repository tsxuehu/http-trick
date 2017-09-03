"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _tls = require("tls");

var _tls2 = _interopRequireDefault(_tls);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _certificationManager = require("../certificationManager");

var _certificationManager2 = _interopRequireDefault(_certificationManager);

var _httpHandle = require("./handle/httpHandle");

var _httpHandle2 = _interopRequireDefault(_httpHandle);

var _wsHandle = require("./handle/wsHandle");

var _wsHandle2 = _interopRequireDefault(_wsHandle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let createSecureContext = _tls2.default.createSecureContext || _crypto2.default.createSecureContext;

/**
 * 1、转发https请求
 * 2、转发wss请求
 */
class HttpsServer {
    constructor(httpsPort) {
        this.httpsPort = httpsPort;
        this.certManger = _certificationManager2.default.getCertificationManager();
    }

    start() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let certification = yield certManger.getCertificationForHost('internal_https_server');

            _this.httpsProxyServer = _https2.default.createServer({
                SNICallback: _this.SNIPrepareCert,
                key: certification.key,
                cert: certification.cert
            }, _httpHandle2.default.getHttpHandle().handle);

            _this.httpsProxyServer.on('upgrade', _wsHandle2.default.getWsHandle().handle);
            _this.httpsProxyServer.on('error', function (err) {
                console.log(err);
                process.exit(0);
            });
            _this.httpsProxyServer.listen(_this.httpsPort, "0.0.0.0");
        })();
    }

    SNIPrepareCert(serverName, SNICallback) {
        cert.generateCertForHost(serverName, function (certificate, privateKey) {
            var ctx = createSecureContext({
                key: privateKey,
                cert: certificate
            });
            SNICallback(null, ctx);
        });
    }
}
exports.default = HttpsServer;