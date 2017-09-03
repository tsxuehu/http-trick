'use strict';

// 构造仓库


// 启动代理


// 输出配置信息


console.log('Zan proxy port: ' + httpPort);
console.log('Zan proxy 配置页面地址：' + 'http://' + pcIp + ':' + webuiPort);
opn('http://' + pcIp + ':' + webuiPort);

// 启动远程文件更新检查
sync.start();