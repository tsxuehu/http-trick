#!/usr/bin/env node
import {startProxy} from "../main";
import {program} from 'commander'
import packageInfo from '../../package.json'

// 启动
async function start() {
    program
        .version(packageInfo.version)
        .option('-p, --proxyPort [value]', '指定代理端口')
        .option('-u, --uiPort [value]', '指定UI端口')
        .option('-s, --socks5Port [value]', '指定socks5端口')
        .option('-d, --dnsPort [value]', '指定dns端口')
        .option('-m, --userMode [value]', '用户模式 ');

    program.parse();

    const opts = program.opts();

    // 启动开发代理服务器
    let proxyPort = opts.proxyPort;
    let uiPort = opts.uiPort;
    let socks5Port = opts.socks5Port;
    let dnsPort = opts.dnsPort;
    let userMode = opts.userMode;

    await startProxy({
        httpProxyPort: proxyPort,
        socks5ProxyPort: socks5Port,
        dnsPort,
        webUiPort: uiPort,
        userMode
    })
}

start();




