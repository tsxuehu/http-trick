var url = require('url');
var axios = require('axios');
import HttpProxy from "../../utils/httpProxy";
/**
 * 请求连接获取返回结果
 */
export default class Remote {
    static getRemote() {

    }

    constructor() {
        this.httpProxy = HttpProxy.getHttpProxy();
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({req, res, protocol, hostname, path, port, headers}) {
        this.httpProxy.web(req, res, {
            target: {
                protocol,
                hostname,
                path,
                port
            },
            headers,
            ignorePath: true,
        });
        return Promise.resolve(true);
    }

    /**
     * 将请求远程的响应内容
     */
    cache({req, res, targetUrl, headers, toSendResponse}) {
        // 设置超时时间，节约socket资源
        return Promise.resolve().then(() => {
            return axios({
                method: req.method,
                url: targetUrl,
                headers: headers,
                maxRedirects: 0,
                responseType: 'text',
                data: req
            });
        }).then(response => {
            toSendResponse.hasContent = true;
            toSendResponse.headers = Object.assign(toSendResponse.headers, response.headers);
            toSendResponse.body = response.data;
        });
    }
}