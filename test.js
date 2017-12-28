const http = require("http");
const fs = require("fs");
const util = require('util');

const proxy = http.createServer((req, res) => {
    let file = fs.createWriteStream("test.pipe");
    req.pipe(file);
    console.log(util.inspect(req.headers));
});
proxy.listen(8001)