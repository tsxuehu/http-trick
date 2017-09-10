import EventEmitter from "events";
import _ from "lodash";
import sendSpecificToClient from "../proxy/sendToClient/specific";
import Remote from "../proxy/content/remote";
/**
 * Created by tsxuehu on 8/3/17.
 */
export default class BreakpointRepository extends EventEmitter {
    constructor(userRepository) {
        super();
        this.remote = Remote.getRemote();
        this.userRepository = userRepository;
        this.currentConnectionId = 20;
        this.currentBreakpointId = 10;
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
         *        req: '', // 浏览器请求对象
         *        res: '', // 浏览器响应对象
         *        requestContent: '',// 浏览器请求内容 （格式参见 HttpHandle._getRequestContent 函数）
         *        responseContent: '',// 服务器响应内容
         *    }
         */
        this.breakpoints = {};

        /**
         * userId -> connectionId 数组
         */
        this.userConnectionMap = {};
    }

    addBreakPoint({
                      userId,
                      connectionId,
                      method,
                      match,
                      requestBreak = false,
                      responseBreak = false
                  }) {
        let id = (this.currentBreakpointId++) + '';

        this.breakpoints[id] = {
            id,
            match, // 匹配正则
            method,// 请求方法
            requestBreak, // 请求断点
            responseBreak, // 响应断点
            userId, // 设置断点的用户id
            connectionId,// 界面连接id
            req: null, // 浏览器请求对象
            res: null, // 浏览器响应对象
            requestContent: {},// 浏览器请求内容 （格式参见 HttpHandle._getRequestContent 函数）
            responseContent: {}// 服务器响应内容
        };
        // 触发断点列表变化通知
        // (分布式环境中，向zookeeper推送通知，repository监听zookeeper通知，然后推送消息给浏览器)
        this.emit('breakpoints', userId, this._getUserBreakPoints(userId));
        return id;
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
        let connectionsCnt = await this._getUserConnectionCount(userId);
        // 没有断点界面，则断点不生效
        if (connectionsCnt == 0) return -1;
        let userBreakPoints = await  this._getUserBreakPoints();
        let finded = _.find(userBreakPoints, (breakpoint, id) => {
                return breakpoint.userId == userId
                    && this._isMethodMatch(method, breakpoint.method)
                    && this._isUrlMatch(urlObj.href, breakpoint.match)
            }) || {id: -1};
        return finded.id;
    }

    async hasRequestBreak(breakpointId) {
        return this.breakpoints[breakpointId].requestBreak;
    }

    async hasResponseBreak(breakpointId) {
        return this.breakpoints[breakpointId].responseBreak;
    }

    /**
     * 获取用户的所有断点
     * @param userId
     * @private
     */
    _getUserBreakPoints(userId) {
        let breakpointsOrigin = _.filter(this.breakpoints, breakpoint => breakpoint.userId == userId);
        return _.map(breakpointsOrigin, breakpoint => {
            return {
                id: breakpoint.id,
                match: breakpoint.match, // 匹配正则
                method: breakpoint.method,// 请求方法
                requestBreak: breakpoint.requestBreak, // 请求断点
                responseBreak: breakpoint.responseBreak, // 响应断点
                userId: breakpoint.userId, // 设置断点的用户id
                connectionId: breakpoint.connectionId,// 界面连接id
                requestContent: breakpoint.requestContent,//
                responseContent: breakpoint.responseContent,//
            }
        })
    }

    /**
     * 获取用户的断点总数
     * @param userId
     * @returns {Number}
     * @private
     */
    _getUserConnectionCount(userId) {
        return (this.userConnectionMap[userId] || []).length;
    }

    setClientRequestContent(id, requestContent, req, res) {
        let userId = this.breakpoints[id].userId;
        this.breakpoints[id].requestContent = requestContent;
        this.breakpoints[id].req = req;
        this.breakpoints[id].res = res;
        if (this.breakpoints[id].requestBreak) {
            this.emit('client-request', userId, id, requestContent);
        }
    }

    setServerResponseContent(id, responseContent) {
        let userId = this.breakpoints[id].userId;
        this.breakpoints[id].responseContent = responseContent;
        if (this.breakpoints[id].responseBreak) {
            this.emit('server-response', userId, id, responseContent);
        }
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
     * 将请求数据发送给服务端
     */
    async sendToServer(breakpointId) {
        // 向服务器发送请求
        let requestContent = this.breakpoints[breakpointId].requestContent;
        let responseContent = this.breakpoints[breakpointId].responseContent;
        await this.remote.cacheFromRequestContent({
            requestContent, toClientResponse: responseContent
        });
    }

    /**
     * 将内容发送给浏览器
     * @param id
     */
    sendToClient(id) {
        // 响应浏览器
        let breakpoint = this.breakpoints[id];
        let res = breakpoint.res;
        let responseContent = breakpoint.responseContent;
        sendSpecificToClient({
            res, statusCode: 200, headers: responseContent.headers, content: responseContent.content
        });
        // 删除
        delete this.breakpoints[id];
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