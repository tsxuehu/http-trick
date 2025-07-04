"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureLogger = configureLogger;
const tslib_1 = require("tslib");
const log4js_1 = tslib_1.__importDefault(require("log4js"));
const path_1 = tslib_1.__importDefault(require("path"));
const util_1 = tslib_1.__importDefault(require("util"));
const config_1 = require("./config");
const trace_1 = require("../utils/trace");
const LayoutConfig = {
    type: 'pattern',
    pattern: '%d{[yyyy-MM-dd hh:mm:ss.SSS]}[%z][%x{traceId}][%p]%c %x{msg}',
    tokens: {
        traceId: function () {
            return (0, trace_1.getTraceId)();
        },
        msg: function (logEvent) {
            let msg = util_1.default.format(...logEvent.data);
            const length = logEvent.data.length || 0;
            if (logEvent.data[length - 1] !== 'all' && msg.length > 500) {
                msg = msg.substring(0, 500) + ' ...';
            }
            return msg;
        }
    }
};
const MaxLogSize = '10M';
const Backups = 3;
function configureLogger() {
    const clientLogFilePath = path_1.default.join(__dirname, '../../logs/outgoing.log');
    const middlewareLogFilePath = path_1.default.join(__dirname, '../../logs/middleware.log');
    const mainLogFilePath = path_1.default.join(__dirname, '../../logs/main.log');
    log4js_1.default.configure({
        appenders: {
            console: { type: 'console', layout: LayoutConfig },
            outgoing: {
                type: 'file',
                filename: clientLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            },
            middleware: {
                type: 'file',
                filename: middlewareLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            },
            main: {
                type: 'file',
                filename: mainLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            }
        },
        categories: {
            default: { appenders: config_1.env.isDev ? ['console', 'main'] : ['main'], level: 'info' },
            outgoing: { appenders: config_1.env.isDev ? ['console', 'outgoing'] : ['outgoing'], level: 'info' },
            middleware: { appenders: config_1.env.isDev ? ['console', 'middleware'] : ['middleware'], level: 'info' },
            main: { appenders: config_1.env.isDev ? ['console', 'main'] : ['main'], level: 'info' },
        }
    });
}
//# sourceMappingURL=log4js.js.map