import Action from './action'

import cookie from  'cookie'
import _ from 'lodash'

let addRequestHeader;
/**
 * 增加请求头
 */
export default class AddRequestHeader extends Action{
    static getAddRequestHeader(){
        if (!addRequestHeader){
            addRequestHeader = new AddRequestHeader();
        }
        return addRequestHeader;
    }

    /**
     * 运行处理动作
     */
    run({
            req,
            res,
            urlObj,
            rule, // 规则
            action, // 规则里的一个动作
            requestHeaders, // 请求头
            toSendResponse //响应内容
        }) {
        var cookies = cookie.parse(req.headers.cookie);
        var tobeSet = cookie.parse(action.data.cookie);
        toSendResponse.headers[`fe-action-${actionIndex}`] = 'add cookie';
        _.forEach(tobeSet, (value, key) => {
            cookies[key] = value;
        });
        var arr = [];
        _.forEach(cookies, (value, key) => {
            arr.push(`${key}=${value}`)
        });
        requestHeaders.Cookie = arr.join(";");
        return Promise.resolve(false);
    }
}