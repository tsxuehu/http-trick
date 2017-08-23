var https = require('https');
var tls = require('tls');
var crypto = require('crypto');
var cert = require("../cert");

var createSecureContext = tls.createSecureContext || crypto.createSecureContext;

var httpHandler = require('./handle/http-handle');
var wsHandle = require('./handle/ws-handle');
var httpsProxyServer;

/**
 * 启动https服务器
 */
module.exports = function createServer(httpProxyPort, httpsProxyPort) {

    cert.generateCertForHost('proxy_internal_https_server', function (certificate, privateKey) {
        httpsProxyServer = https.createServer({
            SNICallback: SNIPrepareCert,
            key: privateKey,
            cert: certificate
        }, httpHandler);

        httpsProxyServer.on('upgrade', wsHandle);
        httpsProxyServer.on('error', function (err) {
            console.log(err);
            process.exit(0);
        });
        httpsProxyServer.listen(httpsProxyPort);
    } );
};

function SNIPrepareCert(serverName, SNICallback) {
     cert.generateCertForHost(serverName, function (certificate, privateKey) {
         var ctx = createSecureContext({
             key: privateKey,
             cert: certificate
         });
         SNICallback(null, ctx);
     } );
}