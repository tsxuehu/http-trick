const { Resolver } = require('dns');
const resolver = new Resolver();
resolver.setServers([
    '127.0.0.1'
]); // 指定解析dns的服务器
resolver.resolve4('www.youzan.com',  (err, addresses) => {
    console.log(err, addresses)
});
