const EventEmitter = require("events");
const _ = require("lodash");

/**
 * 记录三个维护的数据
 * 1、用户打开的断点页面数（连接数）
 * 2、断点请求
 * 3、断点
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class BreakpointRepository extends EventEmitter {

    constructor(userService) {
        super();
        this.userService = userService;
        this.currentConnectionId = 10;// 连接id
        this.currentBreakpointId = 200;// 断点id
        this.currentInstanceId = 3000;// 断点实例id
        /**
         * 断点id-> 断点
         * 断点格式如下：
         * let breakpoint ={
         *        id,
         *        match: '', // 匹配
         *        reqeustBreak: false, // 请求断点
         *        responseBreak: false, // 响应断点
         *        userId: '', // 设置断点的用户id
         *        connectionId,// 界面连接id
         *        requestContent: '',// 浏览器请求内容 （格式参见 HttpHandle._getRequestContent 函数）
         *        responseContent: '',// 服务器响应内容
         *    }
         */
        this.breakpoints = {};
        // 断点实例
        this.instances = {};

        /**
         * userId -> connectionId 数组
         */
        this.userConnectionMap = {};
    }

    // 断点实例
    addInstance({breakpointId, clientIp, href, method}) {
        // 分配断点实例id
        let instanceId = (this.currentInstanceId++) + '';
        let instance = {
            id: instanceId,
            breakpointId,
            clientIp,
            href,
            method,
            sendedToServer: false, // 有没有发送给服务器
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
    // 设置断点请求内容
    setInstanceRequestContent(instanceId, requestContent) {
        let instance = this.instances[instanceId];
        // 找出断点关联的实例
        let breakpointId = instance['breakpointId'];
        let breakpoint = this.breakpoints[breakpointId];

        let userId = breakpoint.userId;

        instance.requestContent = requestContent;
        if (breakpoint.requestBreak) {
            this.emit('instance-client-request', userId, instanceId, requestContent);
        }
    }

    // 设置断点的服务器返回内容
    setInstanceServerResponseContent(instanceId, responseContent) {
        let instance = this.instances[instanceId];

        let breakpointId = instance['breakpointId'];
        let breakpoint = this.breakpoints[breakpointId];

        let userId = breakpoint.userId;
        instance.responseContent = responseContent;
        instance.sendedToServer = true;
        if (breakpoint.responseBreak) {
            this.emit('instance-server-response', userId, instanceId, responseContent);
        }
    }

    /**
     * 请求结束
     * @param instanceId
     */
    sendedInstanceServerResponseToClient(instanceId) {
        let instance = this.instances[instanceId];

        let breakpointId = instance['breakpointId'];
        let breakpoint = this.breakpoints[breakpointId];

        let userId = breakpoint.userId;

        instance.sendedToClient = true;
        this.emit('instance-end', userId, instanceId);
    }

    getInstanceRequestContent(instanceId) {
        return this.instances[instanceId].requestContent;
    }

    getInstanceResponseContent(instanceId) {
        return this.instances[instanceId].responseContent;
    }

    /**
     * 保存断点
     * @param userId
     * @param breakpoints 要保存的断点，如果有id 则是update
     */
    saveBreakpoint({
                       userId, connectionId, match, requestBreak = false, breakpointId,
                       responseBreak = false
                   }) {
        let id = breakpointId;
        if (!id) {
            id = (this.currentBreakpointId++) + '';
        }
        let breakpoint = {
            id,
            match, // 匹配
            requestBreak, // 请求断点
            responseBreak, // 响应断点
            userId: '', // 设置断点的用户id
            connectionId,// 界面连接id
        };
        this.breakpoints[id] = breakpoint;
        this.emit('breakpoint-save', userId, breakpoint);
    }

    getBreakpoint(breakpointId) {
        return this.breakpoints[breakpointId];
    }

    deleteBreakpoint(userId, breakpointId) {
        // 删除断点
        delete this.breakpoints[breakpointId];
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
        this.emit('breakpoint-delete', userId, breakpointId);
    }

    /**
     * 获取用户的所有断点
     * @param userId
     * @private
     */
    getUserBreakPoints(userId) {
        return _.filter(this.breakpoints, breakpoint => breakpoint.userId == userId);
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
        _.remove(connections, function (n) {
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
}