"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPort = require("get-port");

var _getPort2 = _interopRequireDefault(_getPort);

var _repository = require("../repository");

var _repository2 = _interopRequireDefault(_repository);

var _httpServer = require("./httpServer");

var _httpServer2 = _interopRequireDefault(_httpServer);

var _httpsServer = require("./httpsServer");

var _httpsServer2 = _interopRequireDefault(_httpsServer);

var _webui = require("./webui");

var _webui2 = _interopRequireDefault(_webui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Launcher {
    /**
     * 设置repositories
     * @param repositories
     */
    constructor(port, repositories) {
        _repository2.default.setRepositories(repositories);
        this.configureRepository = _repository2.default.getConfigureRepository();
        this.runtimeInfoRepository = _repository2.default.getRuntimeInfoRepository();
        this.port = port;
    }

    /**
     * 启动代理
     * @param port
     */
    start() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // 如果不存在 则从datacenter取默认值
            if (!_this.port) {
                _this.port = _this.configureRepository.getProxyPort();
            }
            // 记录运行时的代理端口
            _this.runtimeInfoRepository.setRealProxyPort(_this.port);

            let httpsPort = yield (0, _getPort2.default)(40005);

            // 启动http转发服务器
            yield new _httpServer2.default(port, httpsPort).start();

            // 启动https转发服务器
            yield new _httpsServer2.default(httpsPort).start();

            let webUiPort = yield (0, _getPort2.default)(40001);

            // 设置运行时的用户界面端口
            _this.runtimeInfoRepository.setRealUiPort(webUiPort);

            // 启动web ui
            yield new _webui2.default(webUiPort).start();
        })();
    }
}
exports.default = Launcher;