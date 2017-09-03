'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _appInfo = require('../../appInfo');

var appInfo = _interopRequireWildcard(_appInfo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let log;
class Log {
    static getLog() {
        if (!log) {
            log = new Log();
        }
        return log;
    }

    constructor() {

        _log4js2.default.configure(_path2.default.join(__dirname, '../../conf/log4js.json'), { cwd: appInfo.proxyDir });
    }

    getExceptionLog() {
        var log = _log4js2.default.getLogger('exception');
        log.setLevel('error');
        return log;
    }

    getConnectLog() {
        var log = _log4js2.default.getLogger('connect');
        log.setLevel('error');
        return log;
    }

    getRequestLog() {
        var log = _log4js2.default.getLogger('request');
        log.setLevel('error');
        return log;
    }
}
exports.default = Log;