#!/usr/bin/env node

var program = require('commander');
var packageInfo = require("./package.json");
var lauchProxy = require('./src/launchProxy');
var notify = require('./src/notify');
var log = require('./src/utils/log').getConnectLog();
var opn = require('opn');
var file = require('./src/utils/file');
var path = require('path');
var runtimeInfoFilePath = path.join(file.getUserHomeConfLocalDir(), 'runtime.json');
var psaux = require('psaux');
var _ = require('lodash');
program
    .version(packageInfo.version)
    .option('-p, --httpPort [value]', '设置启动时的代理端口')
    .option('kill, --kill', '关闭proxy进程')
    .option('config, --config', '打开管理界面')
    .option('info, --info', '显示proxy端口、及管理界面地址')
    .parse(process.argv);

if (program.config || program.info || program.kill) {
    // 查找进程有没有开启
    psaux().then(function(list) {
        var runtimeInfo = file.readJsonFileSync(runtimeInfoFilePath);
        var zanmockP = _.find(list,function(p){
            return p.pid == runtimeInfo.pid;
        });
        if (zanmockP && zanmockP.command.indexOf('zanmock-proxy')> -1) {
            /**
             * 读文件，获取代理服务器所在端口
             */
            var ip = require('ip');
            var url = 'http://' + ip.address() + ':' + runtimeInfo.realUiPort;
            // 三个命令的执行
            if (program.info) {// info
                console.log('proxy port: '+runtimeInfo.realProxyPort);
                console.log('front-end-proxy配置页面地址：' + url);
            } else if (program.kill){// kill
                process.kill(runtimeInfo.pid, 'SIGINT');
            }else {// config
                opn(url);
            }
        }else{
            console.log('还没开启proxy');
        }
        process.exit(0);
    }); 
} else {
    // 启动开发代理服务器
    lauchProxy(program.httpPort);
    process.on("SIGINT", function () {
        process.exit();
    });
    process.on("uncaughtException", function (err) {
        console.log(err);
        log.error(err);
    });
}


