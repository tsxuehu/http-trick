import {Resource, Service} from "di/annotation";
import {ActionRunExtraInfo, generateHeadersInActualRequestData, IProcessContext} from "service/intercept/http";
import ProfileService from "service/manage/ProfileService";
import HostResolveService from "service/intercept/HostResolveService";
import ConfigureService from "service/manage/ConfigureService";
import RemoteContentService from "service/infra/RemoteContentService";
import LocalContentService from "service/infra/LocalContentService";
import mime from "mime";
import {BaseAction} from "service/action";


@Service()
export default class RedirectAction extends BaseAction {
    @Resource() private profileService: ProfileService
    @Resource() private hostResolveService: HostResolveService
    @Resource() private configureService: ConfigureService
    @Resource() private remoteContentService: RemoteContentService
    @Resource() private localContentService: LocalContentService

    needRequestContent() {
        return false;
    }

    needResponse() {
        return false;
    }

    willGetContent() {
        return true;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {userId, originRequestData, toClientResponse} = context;
        const {rule, action} = extraInfo;

        const {href} = originRequestData;
        let target = '';
        target = this.profileService.calcPath(userId, href, rule.match, action.data.target);
        if (!target) {
            throw new Error("target parse empty ");
        }

        toClientResponse.headers['proxy-content'] = encodeURI(target);

        if (target.startsWith('http')) {
            await this._redirectToRemote(target, context, extraInfo)
        } else {
            await this._redirectToLocal(target, context, extraInfo)
        }
    }

    private async _redirectToLocal(target: string, context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {toClientResponse, res} = context;
        const {last, action} = extraInfo;

        const contentType = mime.lookup(target) + ';charset=utf-8';
        if (last) {
            await this.localContentService.pipe({
                filePath: target,
                toClientResponse,
                contentType,
                res
            })
        } else {
            await this.localContentService.cache({
                filePath: target,
                toClientResponse,
                contentType,
            })
        }
    }

    private async _redirectToRemote(target: string, context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {
            userId,
            deviceId,
            toClientResponse,
            req,
            res,
            recordResponse,
            actualRequestData,
            additionalRequestQuery,
            originRequestData
        } = context;
        const {last, action} = extraInfo;

        const redirectUrlObj = new URL(target);

        actualRequestData.protocol = redirectUrlObj.protocol;
        actualRequestData.port = redirectUrlObj.port;

        await this.hostResolveService.resolveHostAndSetInfoToContext(redirectUrlObj.hostname, context);

        // path生成
        const newQuery: Record<string, any> = {};
        for (const [key, value] of redirectUrlObj.searchParams.entries()) {
            newQuery[key] = value;
        }
        if (Object.keys(newQuery).length > 0) {
            Object.assign(newQuery, additionalRequestQuery);
            const newParams = new URLSearchParams(newQuery)
            actualRequestData.path = `${redirectUrlObj.pathname}?${newParams.toString()}`;
        } else {
            actualRequestData.path = `${redirectUrlObj.pathname}${redirectUrlObj.search}`
        }
        generateHeadersInActualRequestData(context)

        actualRequestData.timeout = +this.configureService.getRequestTimeout();
        actualRequestData.body = originRequestData.body

        const proxyInfo = this.profileService.getExternalProxy(userId, deviceId);

        if (last) {
            await this.remoteContentService.pipe({
                req, res, recordResponse, actualRequestData, toClientResponse, proxyInfo
            })
        } else {
            await this.remoteContentService.cache({
                req, recordResponse, actualRequestData, toClientResponse, proxyInfo
            })
        }
    }
}
