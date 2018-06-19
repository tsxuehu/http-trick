#!/usr/bin/env node
const program = require('commander');
const packageInfo = require("./package.json");
const log = require('./src/core/utils/log');
const Launcher = require('./src/launcher');
const AppInfoService = require("./src/impl/file/appInfoService");
const fs = require('fs');
const resetDataFile = require('./resetDataFile');

process.on("SIGINT", function () {
    process.exit();
});
process.on("uncaughtException", function (err) {
    log.error(err);
});
process.on('unhandledRejection', (reason, p) => {
    log.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// 启动
async function start() {
    /**
     * 检查是否初始化过，没有初始化，则初始化
     */
    let appInfoService = new AppInfoService();
    let proxyDataDir = appInfoService.getProxyDataDir();
    if (!fs.existsSync(proxyDataDir)) {
        await resetDataFile();
    }

    program
        .version(packageInfo.version)
        .option('-p, --proxyPort [value]', '指定代理端口')
        .option('-u, --uiPort [value]', '指定UI端口')
        .option('-s, --socks5Port [value]', '指定socks5端口')
        .option('-m, --userMode [value]', '用户模式 ')
        // .option('-s, --serviceType [value]', '启动类型，默认desktop')
        .parse(process.argv);

    // 启动开发代理服务器
    let proxyPort = program.proxyPort;
    let uiPort = program.uiPort;
    let socks5Port = program.socks5Port;
    let userMode = program.userMode;
    let serviceType = program.serviceType;

    let launcher = new Launcher(proxyPort, socks5Port, uiPort, serviceType, userMode);
    launcher.start();
}

start();




