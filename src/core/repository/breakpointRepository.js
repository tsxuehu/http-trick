import EventEmitter from "events";
import _ from "lodash";

/**
 * 记录三个维护的数据
 * 1、用户打开的断点页面数（连接数）
 * 2、断点请求
 * 3、断点
 * Created by tsxuehu on 8/3/17.
 */
export default class BreakpointRepository extends EventEmitter {
    constructor(userRepository) {
        super();

        this.userRepository = userRepository;
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

    setInstanceRequestContent(instanceId, requestContent) {
        let instance = this.instances[instanceId];

        let breakpointId = instance['breakpointId'];
        let breakpoint = this.breakpoints[breakpointId];

        let userId = breakpoint.userId;
        instance.requestContent = requestContent;
        if (breakpoint.requestBreak) {
            this.emit('instance-client-request', userId, instanceId, requestContent);
        }
    }

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

    getInstanceRequestContent(instanceId){
        return this.instances[instanceId].requestContent;
    }

    getInstanceResponseContent(instanceId){
        return this.instances[instanceId].responseContent;
    }
    /**
     * 如果有断点返回断点id，没有断点则返回-1
     * @param clientIp
     * @param method
     * @param urlObj
     */
    async getBreakpointId(clientIp, method, urlObj) {
        // clientIp 转 userId
        let userId = await this.userRepository.getClientIpMappedUserId(clientIp);
        let connectionsCnt = await this.getUserConnectionCount(userId);
        // 没有断点界面，则断点不生效
        if (connectionsCnt == 0) return -1;
        let userBreakPoints = await this.getUserBreakPoints(userId);
        let finded = _.find(userBreakPoints, (breakpoint, id) => {
                return breakpoint.userId == userId
                    && this._isMethodMatch(method, breakpoint.method)
                    && this._isUrlMatch(urlObj.href, breakpoint.match)
            }) || {id: -1};
        return finded.id;
    }

    hasRequestBreak(breakpointId) {
        return this.breakpoints[breakpointId].requestBreak;
    }

    hasResponseBreak(breakpointId) {
        return this.breakpoints[breakpointId].responseBreak;
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

    // 请求的方法是否匹配规则
    _isMethodMatch(reqMethod, breakpointMethod) {
        let loweredReqMethod = _.lowerCase(reqMethod);
        let loweredBreakpointMethod = _.lowerCase(breakpointMethod);
        return loweredReqMethod == loweredBreakpointMethod
            || !breakpointMethod;
    }

    // 请求的url是否匹配规则
    _isUrlMatch(reqUrl, breakpointMatchStr) {
        return breakpointMatchStr && (reqUrl.indexOf(breakpointMatchStr) >= 0
            || (new RegExp(breakpointMatchStr)).test(reqUrl));
    }
}