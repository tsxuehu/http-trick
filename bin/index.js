#!/usr/bin/env node
const program = require('commander');
const packageInfo = require("../package.json");
const log = require('../src/utils/log');
const Launcher = require('../src/launcher');
const AppInfoService = require("../src/service/appInfoService");
const fs = require('fs');
const resetDataFile = require('./resetDataFile');

process.on("SIGINT", function () {
  process.exit();
});
process.on("uncaughtException", function (err) {
  log.error('uncaughtException', err);
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
    .option('-d, --dnsPort [value]', '指定dns端口')
    .option('-m, --userMode [value]', '用户模式 ')
    .parse(process.argv);

  // 启动开发代理服务器
  let proxyPort = program.proxyPort;
  let uiPort = program.uiPort;
  let socks5Port = program.socks5Port;
  let dnsPort = program.dnsPort;
  let userMode = program.userMode;

  let launcher = new Launcher({
    httpProxyPort: proxyPort,
    socks5ProxyPort: socks5Port,
    dnsPort,
    webUiPort: uiPort,
    userMode
  });
  launcher.start();
}

start();




