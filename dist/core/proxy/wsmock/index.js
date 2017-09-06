'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by tsxuehu on 17/3/21.
 */
var _ = require('lodash');

var EventEmitter = require('events');

/**
 * hack， 创建一个不监听端口的server，让wss暴露handleUpgrade函数
 */
var WebSocket = require('ws');
var http = require('http');
var wss = new WebSocket.Server({
    server: http.createServer(function (req, res) {
        res.end();
    })
});

var currentSessionId = 1024;
/**
 * sessionId 及其对应的 信息说明
 * 信息说明格式为
 * sessionId
 * socketId
 * urlPattern
 * assigned
 * page
 */
var sessionIdInfo = {};
let wsMock;

/**
 * websocket mock
 * 和ws mock responsitory通信 实现mock功能
 */
class WsMock {

    static getWsMock() {
        if (!wsMock) {
            wsMock = new WsMock();
        }
        return wsMock;
    }

    constructor() {
        this.event = new EventEmitter();
    }

    getFreeSession(url) {
        var session = _.find(sessionIdInfo, function (sessionInfo) {
            return !sessionInfo.assigned && url.indexOf(sessionInfo.urlPattern) > -1;
        });
        if (!session) return false;
        // 分配mock终端，返回终端id
        session.assigned = true;
        return session.sessionId;
    }

    handleUpgrade(req, socket, head, sessionId, url) {

        this.event.emit('page-connected', sessionId);
        this.event.emit('page-msg', sessionId, '[url]: ' + url);
        wss.handleUpgrade(req, socket, head, function (page) {
            sessionIdInfo[sessionId].page = page;
            // 浏览器页面发出的消息，转发给监控终端
            page.on('message', function (data) {
                event.emit('page-msg', sessionId, data);
            });

            page.on('close', function () {
                this.event.emit('page-closed', sessionId);
                // 调试结束 释放会话
                if (!sessionIdInfo[sessionId]) return;
                sessionIdInfo[sessionId].assigned = false;
                sessionIdInfo[sessionId].page = null;
            });
        });
    }

    sendToPageMsg(sessionId, data) {
        sessionIdInfo[sessionId].page && sessionIdInfo[sessionId].page.send(data);
    }

    on(eventanme, callback) {
        this.event.on(eventanme, callback);
    }

    // 分配调试会话id
    openSession(socketId, urlPattern) {
        var sessionId = currentSessionId++;
        sessionIdInfo[sessionId] = {
            sessionId: sessionId, // 会话id
            socketId: socketId, // session对应的调试者socket id
            urlPattern: urlPattern, // url特征
            assigned: false, // 是否分配被调试的页面
            page: null // 会话对应的调试页面
        };
        return sessionId;
    }

    closeSession(sessionId) {
        sessionIdInfo[sessionId] && sessionIdInfo[sessionId].page && sessionIdInfo[sessionId].page.close();
        delete sessionIdInfo[sessionId];
    }

    closeAllSessionInSocket(socketId) {
        var sessionIds = [];
        _.forEach(sessionIdInfo, function (sessionInfo, sessionId) {
            if (sessionInfo.socketId == socketId) {
                // 关闭session
                sessionInfo.page && sessionInfo.page.close();
                sessionIds.push(sessionId);
            }
        });
        _.forEach(sessionIds, function (sessionId) {
            delete sessionIdInfo[sessionId];
        });
    }
}exports.default = WsMock;
;