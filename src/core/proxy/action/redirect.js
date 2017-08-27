import Action from "./action";
import _ from "lodash";
import Repository from "../../repository";
import sendErrorToClient from "../sendToClient/error";
import Local from "../content/local";
import url from "url";
import Remote from "../content/remote";

/**
 * 重定向 本地 或者 远程
 */
export default class Redirect extends Action {
    static getRedirect() {

    }

    constructor() {
        super();
        this.hostRepository = Repository.getHostRepository();
        this.configureRepository = Repository.getConfigureRepository();
        this.remote = Remote.getRemote();
        this.local = Local.getLocal();
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
        //================== 转发到本地 或远程
        let {href} = urlObj;
        // 解析目标
        let target = this.configureRepository.calcPath(clientIp, href, rule.match, action.data.target);
        if (!target) {
            toClientResponse.sendedToClient = true;
            sendErrorToClient(req, res, 500, 'target parse error' + action.data.target);
            return;
        }
        // 远程
        if (target.startsWith('http')) {
            await this._toRemote({
                req,
                res,
                clientIp,
                target,
                extraRequestHeaders,
                toClientResponse,
                last
            });
        } else {// 本地文件
            await this._toLocal({
                req,
                res,
                clientIp,
                target,
                rule,
                action,
                requestContent,
                extraRequestHeaders,
                toClientResponse,
                last
            });
        }


    }


    async _toRemote({
                        req,
                        res,
                        clientIp,
                        target,
                        extraRequestHeaders, // 请求头
                        toClientResponse, //响应内容
                        last
                    }) {
        let redirectUrlObj = url.parse(target);
        let {protocol, hostname, path, port} = redirectUrlObj;

        let ipOrHost = this.hostRepository.resolveHost(clientIp, hostname);

        port = port || ('https:' == protocol ? 443 : 80);

        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;
        res.setHeader('fe-proxy-content', encodeURI(targetUrl));

        let headers = _.assign({}, req.headers, extraRequestHeaders);
        if (last) {
            toClientResponse.sendedToClient = true;
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

    async _toLocal({
                       req,
                       res,
                       urlObj,
                       clientIp,
                       target,
                       rule, // 规则
                       action, // 规则里的一个动作
                       requestContent, // 请求内容
                       extraRequestHeaders, // 请求头
                       toClientResponse, //响应内容
                       last
                   }) {

        res.setHeader('fe-proxy-content', encodeURI(target));

        if (last) {
            toClientResponse.sendedToClient = true;
            this.local.pipe({
                req,
                res,
                path: target
            });
        } else {
            await this.local.pipe({
                req,
                res,
                path: target,
                toClientResponse
            });
        }
    }
}