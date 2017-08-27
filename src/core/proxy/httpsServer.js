import https from "https";
import tls from "tls";
import crypto from "crypto";

import CertificationManager from "../certificationManager";
import HttpHandle from "./handle/httpHandle";
import WsHandle from "./handle/wsHandle";

let createSecureContext = tls.createSecureContext || crypto.createSecureContext;

/**
 * 1、转发https请求
 * 2、转发wss请求
 */
export default class HttpsServer {
    constructor(httpsPort) {
        this.httpsPort = httpsPort;
        this.certManger = CertificationManager.getCertificationManager();
    }

    async start() {
        let certification = await certManger.getCertificationForHost('internal_https_server');

        this.httpsProxyServer = https.createServer({
            SNICallback: this.SNIPrepareCert,
            key: certification.key,
            cert: certification.cert
        }, HttpHandle.getHttpHandle().handle);

        this.httpsProxyServer.on('upgrade', WsHandle.getWsHandle().handle);
        this.httpsProxyServer.on('error', function (err) {
            console.log(err);
            process.exit(0);
        });
        this.httpsProxyServer.listen(this.httpsPort,"0.0.0.0");
    }

    SNIPrepareCert(serverName, SNICallback) {
        cert.generateCertForHost(serverName, function (certificate, privateKey) {
            var ctx = createSecureContext({
                key: privateKey,
                cert: certificate
            });
            SNICallback(null, ctx);
        });
    }
}