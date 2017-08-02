/**
 * Created by tsxuehu on 17/2/24.
 */
var Vue = require('vue');
var path = require('path');
var fs = require('fs');
var file = require('../../utils/file');
var _ = require('lodash');
// 读证书
var keyPem = fs.readFileSync(path.join(__dirname, '../../../rootca/zproxy.key.pem'), 'utf-8');
var crtPem = fs.readFileSync(path.join(__dirname, '../../../rootca/zproxy.crt.pem'), 'utf-8');
// 用于生成csr
var clientKey = fs.readFileSync(path.join(__dirname, '../../../rootca/clientKey.pem'), 'utf-8');

module.exports = function (store, localConfDir) {
    return {
        // 配置信息
        getConf: function () {
            return store.conf;
        },
        setConf: function (conf) {
            store.conf = conf;
            file.writeJsonFile(path.join(localConfDir, 'conf.json'), conf)
        },
        getGitlabToken: function () {
            return store.conf.gitlabToken;
        },
        enableRule: function () {
            Vue.set(store.conf, 'enableRule', true);
            file.writeJsonFile(path.join(localConfDir, 'conf.json'), store.conf)
        },
        disableRule: function () {
            Vue.set(store.conf, 'enableRule', false);
            file.writeJsonFile(path.join(localConfDir, 'conf.json'), store.conf)
        },
        getRequestTimeoutTime: function () {
            return (store.conf.requestTimeoutTime && parseInt(store.conf.requestTimeoutTime)) || 10000;
        },
        /**
         * local类型的responder使用，路径为'/<%= ironHome%>/build/hi.js'中的ironHome被conf中的变量替换
         */
        resolvePath: function (pathTemplate) {
            var compiled = _.template(pathTemplate);
            return compiled(store.conf.responderParams);
        },
        getRootCAKeyPem: function () {
            return keyPem;
        },
        getRootCACertPem: function () {
            return crtPem;
        },
        getClientKeyPem: function () {
            return clientKey;
        }
    }
};