const EventEmitter = require("events");
const _ = require("lodash");
const path = require("path");
const fileUtils = require("../../core/utils/file");
const Remote = require('../../core/utils/remote');

/**
 * 记录三个维护的数据
 * 1、用户打开的断点页面数（连接数）
 * 2、断点请求
 * 3、断点
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class BreakpointService extends EventEmitter {

    constructor({userService, appInfoService, logService}) {
        super();
        this.userService = userService;
        this.appInfoService = appInfoService;
        this.currentConnectionId = 10;// 连接id
        this.currentInstanceId = 3000;// 断点实例id

        this.remote = Remote.getInstance();

        this.appInfoService = appInfoService;
        let proxyDataDir = this.appInfoService.getProxyDataDir();
        // 监控数据缓存目录
        this.breakpointSaveFile = path.join(proxyDataDir, "breakpoints.json");
        /**
         * 断点id-> 断点
         * 断点格式如下：
         * let breakpoint = {
         *   id,
         *   enable: true, // 是否开启断点
         *   match, // 匹配
         *   requestBreak, // 请求断点
         *   responseBreak, // 响应断点
         *   userId: '', // 设置断点的用户id
         *   connectionId,// 界面连接id
         *};
         */
        this.breakpoints = {}; // 断点 userId -> { id -> breakpoint }

        /**
         * 断点实例id -> 断点实例
         * let instance = {
         *   id: instanceId,
         *   breakpointId,
         *   clientIp,
         *   href,
         *   method,
         *   gettedServerResponse: false, // 有没有发送给服务器
         *   sendedToClient: false, // 有没有发送给浏览器
         *   requestContent: {},// 浏览器请求内容 （格式参见 HttpHandle._getRequestContent 函数）
         *   responseContent: {}// 服务器响应内容
         *}
         */
        this.instances = {}; // 断点实例  id -> instance

        this.userConnectionMap = {}; // userId -> [connectionId, connectionId ...]
    }

    async start() {
        this.breakpoints = await fileUtils.readJsonFromFile(this.breakpointSaveFile);
    }

    /**
     * 保存断点
     * @param userId
     * @param breakpoints 要保存的断点，如果有id 则是update
     */
    async saveBreakpoint({
                             userId, connectionId, match, requestBreak = false, breakpointId,
                             responseBreak = false
                         }) {
        let id = breakpointId;
        if (!id) {
            id = new Date().getTime();
        }
        let breakpoint = {
            id,
            enable: true, // 是否开启断点
            match, // 匹配
            requestBreak, // 请求断点
            responseBreak, // 响应断点
            userId, // 设置断点的用户id
        };
        let userBreakPoints = this.breakpoints[userId] || {};
        userBreakPoints[id] = breakpoint;

        this.breakpoints[userId] = userBreakPoints;
        this.emit('breakpoint-save', userId, breakpoint);

        // 保存断点
        await fileUtils.writeJsonToFile(this.breakpointSaveFile, this.breakpoints);
    }

    getBreakpoint(clientIp, breakpointId) {
        let userId = this.userService.getClientIpMappedUserId(clientIp);
        return this.breakpoints[userId][breakpointId];
    }

    async deleteBreakpoint(userId, breakpointId) {
        // 删除断点
        delete this.breakpoints[userId][breakpointId];
        // 删除断点实例
        let toDeleteInstance = [];
        _.forEach(this.instances, instance => {
            if (instance.breakpointId == breakpointId) {
                toDeleteInstance.push(instance.id);
            }
        });
        _.forEach(toDeleteInstance, id => {
            delete this.instances[id];
        });
        this.emit('breakpoint-delete', userId, breakpointId, toDeleteInstance);
        // 保存断点
        await fileUtils.writeJsonToFile(this.breakpointSaveFile, this.breakpoints);
        // 返回删除的instance id
        return toDeleteInstance;
    }

    /**
     * 获取用户的所有断点
     * @param userId
     * @private
     */
    getUserBreakPoints(userId) {
        return this.breakpoints[userId];
    }

    // 断点实例
    addInstance({breakpointId, clientIp, href, method}) {

        let userId = this.userService.getClientIpMappedUserId(clientIp);
        // 分配断点实例id
        let instanceId = (this.currentInstanceId++) + '';
        let instance = {
            id: instanceId,
            breakpointId,
            userId,
            clientIp,
            href,
            method,
            gettedServerResponse: false, // 有没有发送给服务器
            sendedToClient: false, // 有没有发送给浏览器
            requestContent: {},// 浏览器请求内容 （格式参见 HttpHandle._getRequestContent 函数）
            responseContent: {}// 服务器响应内容
        };
        this.instances[instanceId] = instance;
        // 触发断点列表变化通知
        // (分布式环境中，向zookeeper推送通知，repository监听zookeeper通知，然后推送消息给浏览器)
        this.emit('instance-add', userId, instance);
        return instanceId;
    }

    // 设置断点实例请求内容
    setInstanceRequestContent(instanceId, requestContent) {
        let instance = this.instances[instanceId];
        // 找出断点关联的实例
        let breakpointId = instance['breakpointId'];
        let userId = instance['userId'];
        let breakpoint = this.breakpoints[userId][breakpointId];

        instance.requestContent = requestContent;
        // 如果是请求断点，则将内容发送给界面
        if (breakpoint.requestBreak) {
            this.emit('set-instance-request-content', userId, instanceId, requestContent);
        }
    }

    /**
     * 将请求数据发送给服务端,获取服务器返回内容
     */
    async getServerResponse(instanceId){
        let requestContent = this.getInstanceRequestContent(instanceId);
        let responseContent = {};
        await this.remote.cacheFromRequestContent({
            requestContent, toClientResponse: responseContent
        });
        // 设置返回内容
        this.setInstanceServerResponseContent(instanceId, responseContent);

    }

    // 设置断点的服务器返回内容
    setInstanceServerResponseContent(instanceId, responseContent) {
        let instance = this.instances[instanceId];

        let breakpointId = instance['breakpointId'];
        let userId = instance['userId'];
        let breakpoint = this.breakpoints[userId][breakpointId];

        instance.responseContent = responseContent;
        instance.gettedServerResponse = true;
        if (breakpoint.responseBreak) {
            this.emit('set-instance-server-response', userId, instanceId, responseContent);
        }
    }

    sendToClient(instanceId){
        let instance = this.instances[instanceId];
        instance.sendedToClient = true;
        this.emit('send-instance-to-client', instanceId);
    }

    deleteInstanceSlient(instanceId){
        delete this.instances[instanceId];
    }

    getInstanceRequestContent(instanceId) {
        return this.instances[instanceId].requestContent;
    }

    getInstanceResponseContent(instanceId) {
        return this.instances[instanceId].responseContent;
    }


    /**
     * 为用户分配一个连接id
     * @param userId
     */
    newConnectionId(userId) {
        let id = (this.currentConnectionId++) + '';
        let connections = this.userConnectionMap[userId] || [];
        connections.push(id);
        this.userConnectionMap[userId] = connections;
        return id;
    }

    /**
     * 用户关闭连接，当一个用户没有连接时，关闭该用户的所有断点
     * @param userId
     * @param connectionId
     */
    connectionClosed(userId, connectionId) {
        let connections = this.userConnectionMap[userId] || [];
        _.remove(connections, n => {
            return n == connectionId;
        });
        this.userConnectionMap[userId] = connections;
    }

    /**
     * 获取用户的链接总数
     * @param userId
     * @returns {Number}
     * @private
     */
    getUserConnectionCount(userId) {
        return (this.userConnectionMap[userId] || []).length;
    }
};