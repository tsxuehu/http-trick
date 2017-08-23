#!/usr/bin/env node
require('babel-polyfill');
var program = require('commander');
var packageInfo = require("./../package.json");
var lauchProxy = require('./src/launchProxy');

var log = require('./core/utils/log').getConnectLog();
program
    .version(packageInfo.version)
    .option('-p, --proxyPort [value]', '指定代理端口')
    .option('-t, --type [value]', '启动类型，默认desktop')
    .parse(process.argv);

// 启动开发代理服务器
lauchProxy(program.proxyPort);

process.on("SIGINT", function () {
    process.exit();
});
process.on("uncaughtException", function (err) {
    log.error(err);
});



