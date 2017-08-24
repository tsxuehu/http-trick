import path from  'path';

import log4js from  'log4js';
import * as appInfo from '../../appInfo';

let log;
export default class Log {
    static getLog() {
        if (!log) {
            log = new Log();
        }
        return log;
    }

    constructor() {

        log4js.configure(path.join(__dirname, '../../conf/log4js.json'), {cwd: appInfo.userConfigDir});
    }

    getExceptionLog() {
        var log = log4js.getLogger('exception');
        log.setLevel('error');
        return log;
    }

    getConnectLog() {
        var log = log4js.getLogger('connect');
        log.setLevel('error');
        return log;
    }

    getRequestLog() {
        var log = log4js.getLogger('request');
        log.setLevel('error');
        return log;
    }
}