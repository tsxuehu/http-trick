import Action from "./action";
import Remote from "../content/remote";
import _ from "lodash";
import Repository from "../../repository";
let bypass;
export default class Bypass extends Action {
    static getBypass() {
        if (!bypass) {
            bypass = new Bypass();
        }
        return bypass;
    }

    constructor() {
        super();
        this.hostRepository = Repository.getHostRepository();
        this.remote = Remote.getRemote();
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
        let headers = _.assign({}, req.headers, extraRequestHeaders);

        let ipOrHost = this.hostRepository.resolveHost(clientIp, hostname);
        let targetUrl = protocol + '//' + ipOrHost + ':' + port + path;

        res.setHeader('fe-proxy-content', encodeURI(targetUrl));

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
}