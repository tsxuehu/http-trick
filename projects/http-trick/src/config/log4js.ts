import log4js, {LoggingEvent} from 'log4js';
import path from 'path';
import util from "util";
import {env} from "./config";
import {getTraceId} from "../utils/trace";

const LayoutConfig = {
    type: 'pattern',
    pattern: '%d{[yyyy-MM-dd hh:mm:ss.SSS]}[%z][%x{traceId}][%p]%c %x{msg}',
    tokens: {
        traceId: function () {
            return getTraceId()
        },
        msg: function (logEvent: LoggingEvent) {
            let msg = util.format(...logEvent.data)
            // @ts-ignore
            const length = logEvent.data.length || 0
            if (logEvent.data[length - 1] !== 'all' && msg.length > 500) {
                msg = msg.substring(0, 500) + ' ...'
            }
            return msg
        }
    }
}
const MaxLogSize = '10M'
const Backups = 3

export function configureLogger() {
    const clientLogFilePath = path.join(__dirname, '../../logs/outgoing.log')
    const middlewareLogFilePath = path.join(__dirname, '../../logs/middleware.log')
    const mainLogFilePath = path.join(__dirname, '../../logs/main.log')

    log4js.configure({
        appenders: {
            console: {type: 'console', layout: LayoutConfig, level: 'error'},
            outgoing: {
                type: 'file',
                filename: clientLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            },
            ui: {
                type: 'file',
                filename: middlewareLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            },
            proxy: {
                type: 'file',
                filename: mainLogFilePath,
                maxLogSize: MaxLogSize,
                backups: Backups,
                layout: LayoutConfig,
                compress: true
            }
        },
        categories: {
            default: {appenders: ['console', 'proxy'], level: 'info'},
            outgoing: {appenders: ['console', 'outgoing'], level: 'info'},
            ui: {appenders: ['console', 'ui'], level: 'info'},
            proxy: {appenders: ['console', 'proxy'], level: 'info'},
        }
    });
}
