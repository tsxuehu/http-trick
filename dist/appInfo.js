"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confDir = exports.tempDir = exports.proxyDir = undefined;
exports.getIsServer = getIsServer;
exports.setIsServer = setIsServer;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _isServer = false;
/**
 * 是否运行在服务器端
 * @returns {boolean}
 */
function getIsServer() {
  return _isServer;
}

function setIsServer(isServer) {
  _isServer = isServer;
}

/**
 * 获取配置目录
 */
let userHome = process.env.HOME || process.env.USERPROFILE;
// 配置目录
let proxyDir = exports.proxyDir = _path2.default.join(userHome, ".front-end-proxy");
let tempDir = exports.tempDir = _path2.default.join(proxyDir, "temp"); // http请求存放目录
let confDir = exports.confDir = _path2.default.join(proxyDir, "conf"); // conf请求存放目录