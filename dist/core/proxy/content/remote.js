'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _httpProxy = require('../../utils/httpProxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = require('url');
var axios = require('axios');

/**
 * 请求连接获取返回结果
 */

let remote;
class Remote {
    static getRemote() {
        if (!remote) {
            remote = new Remote();
        }
        return remote;
    }

    constructor() {
        this.httpProxy = _httpProxy2.default.getHttpProxy();
    }

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    pipe({ req, res, protocol, hostname, path, port, headers }) {
        this.httpProxy.web(req, res, {
            target: {
                protocol,
                hostname,
                path,
                port
            },
            headers,
            ignorePath: true
        });
        return Promise.resolve(true);
    }

    /**
     * 将请求远程的响应内容
     */
    cache({ req, res, targetUrl, headers, toClientResponse }) {
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
            toClientResponse.hasContent = true;
            toClientResponse.headers = _.assign({}, response.headers, toClientResponse.headers);
            toClientResponse.body = response.data;
        });
    }
}
exports.default = Remote;