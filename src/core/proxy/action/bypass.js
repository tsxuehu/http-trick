const Action = require("./action");
const Remote = require("../../utils/remote");
const _ = require("lodash");
const ServiceRegistry = require("../../service");
const addHeaderToResponse = require("../../utils/addHeaderToResponse");

let bypass;
module.exports = class Bypass extends Action {
    static getInstance() {
        if (!bypass) {
            bypass = new Bypass();
        }
        return bypass;
    }

    constructor() {
        super();
        this.hostRepository = ServiceRegistry.getHostService();
        this.remote = Remote.getRemote();
    }

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return true;
    }

    /**
     * 运行处理动作
     */
    async run({
                  req,
                  res,
                  urlObj,
                  clientIp,
                  rule, // 规则
                  action, // 规则里的一个动作
                  requestContent, // 请求内容
                  extraRequestHeaders, // 请求头
                  toClientResponse, //响应内容
                  last = true
              }) {
        // 构造url
        let {protocol, hostname, path, port} = urlObj;

        let ipOrHost = await this.hostRepository.resolveHost(clientIp, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        toClientResponse.headers['fe-proxy-content'] = encodeURI(targetUrl);

        let headers = _.assign({}, req.headers, extraRequestHeaders);

        if (last) {
            toClientResponse.sendedToClient = true;
            addHeaderToResponse(res, toClientResponse.headers);
            this.remote.pipe({
                req, res,
                protocol, hostname, path, port, headers
            });
        } else {
            this.remote.cache({
                req, res,
                targetUrl, headers, toClientResponse
            });
        }
    }
}