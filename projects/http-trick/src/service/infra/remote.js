const axios = require("axios");
const queryString = require("query-string");
const log = require("./log");
const _ = require("lodash");
const http = require('http');
const https = require('https');
const toClientResponseUtils = require('./toClientResponseUtils');
const requestResponseUtils = require('./requestResponseUtils');
const SocksProxyAgent = require('./socksAgent');
const StreamMonitor = require('./stream-monitor');
/**
 * 从远程服务器上获取响应内容
 */

let remote;

module.exports = class Remote {
    static getInstance() {
        if (!remote) {
            remote = new Remote();
        }
        return remote;
    }

    constructor() {
    }


};
