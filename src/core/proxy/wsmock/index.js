/**
 * Created by tsxuehu on 17/3/21.
 */
const _ = require('lodash');

const ServiceRegistry = require("../../service");
const EventEmitter = require('events');

/**
 * hack， 创建一个不监听端口的server，让wss暴露handleUpgrade函数
 */
const WebSocket = require('ws');
const http = require('http');
const wss = new WebSocket.Server({
    server: http.createServer(function (req, res) {
        res.end();
    })
});

let currentSessionId = 1024;
/**
 * sessionId 及其对应的 信息说明
 * 信息说明格式为
 * sessionId
 * socketId
 * urlPattern
 * assigned
 * page
 */
let sessionIdInfo = {};
let wsMock;

/**
 * websocket mock
 * 和ws mock responsitory通信 实现mock功能
 */
export default class WsMock extends EventEmitter {

    static getInstance() {
        if (!wsMock) {
            wsMock = new WsMock();
        }
        return wsMock;
    }

    constructor() {
        super();
        this.WsMockService = ServiceRegistry.getWsMockRepository();
    }

    getFreeSession(url) {
        let session = _.find(sessionIdInfo, function (sessionInfo) {
            return !sessionInfo.assigned && url.indexOf(sessionInfo.urlPattern) > -1;
        });
        if (!session) return false;
        // 分配mock终端，返回终端id
        session.assigned = true;
        return session.sessionId;
    }

    handleUpgrade(req, socket, head, sessionId, url) {

        this.WsMockService.pageConnected(sessionId);
        this.WsMockService.pageSendMessage(sessionId, '[url]: ' + url);
        wss.handleUpgrade(req, socket, head, function (page) {
            sessionIdInfo[sessionId].page = page;
            // 浏览器页面发出的消息，转发给监控终端
            page.on('message', function (data) {
                this.WsMockService.pageSendMessage(sessionId, data);
            });

            page.on('close', function () {
                this.WsMockService.pageClosed(sessionId);
                // 调试结束 释放会话
                if (!sessionIdInfo[sessionId]) return;
                sessionIdInfo[sessionId].assigned = false;
                sessionIdInfo[sessionId].page = null;
            });
        });
    }

    /**
     * 向页面发送消息
     * @param sessionId
     * @param data
     */
    sendToPageMsg(sessionId, data) {
        sessionIdInfo[sessionId].page && sessionIdInfo[sessionId].page.send(data);
    }

    // 分配调试会话id
    openSession(socketId, urlPattern) {
        let sessionId = currentSessionId++;
        sessionIdInfo[sessionId] = {
            sessionId: sessionId, // 会话id
            socketId: socketId, // session对应的调试者socket id
            urlPattern: urlPattern,// url特征
            assigned: false, // 是否分配被调试的页面
            page: null // 会话对应的调试页面
        };
        return sessionId;
    }

    closeSession(sessionId) {
        sessionIdInfo[sessionId] && sessionIdInfo[sessionId].page && sessionIdInfo[sessionId].page.close();
        delete sessionIdInfo[sessionId];
    }

    closeAllSessionInConnection(socketId) {
        let sessionIds = [];
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
};