import {Resource, Service} from "di/annotation";
import {
    ActionRunExtraInfo,
    generateHeadersInActualRequestData, getTargetUrl,
    IProcessContext,
    setError
} from "service/intercept/http";
import ProfileService from "service/manage/ProfileService";
import HostResolveService from "service/intercept/HostResolveService";
import ConfigureService from "service/manage/ConfigureService";
import RemoteContentService from "service/infra/RemoteContentService";
import cookie from "cookie";
import {BaseAction} from "service/action";


@Service()
export default class BypassAction extends BaseAction {

    @Resource() private profileService: ProfileService
    @Resource() private hostResolveService: HostResolveService
    @Resource() private configureService: ConfigureService
    @Resource() private remoteContentService: RemoteContentService

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
        const {
            req, res,
            actualRequestData,
            originRequestData,
            additionalRequestQuery,
            toClientResponse,
            recordResponse,
            userId,
            deviceId
        } = context
        const {last} = extraInfo
        actualRequestData.protocol = originRequestData.protocol;
        actualRequestData.port = originRequestData.port;

        await this.hostResolveService.resolveHostAndSetInfoToContext(originRequestData.hostname, context);

        if (Object.keys(additionalRequestQuery).length > 0) {
            let actualRequestQuery: Record<string, any> = {...originRequestData.query}
            Object.assign(actualRequestQuery, additionalRequestQuery);
            const newParams = new URLSearchParams(actualRequestQuery)
            actualRequestData.path = `${originRequestData.pathname}?${newParams.toString()}`;
        } else {
            actualRequestData.path = originRequestData.path
        }

        generateHeadersInActualRequestData(context)

        actualRequestData.timeout = +this.configureService.getRequestTimeout();
        actualRequestData.body = originRequestData.body

        const proxyInfo = this.profileService.getExternalProxy(userId, deviceId);


        const targetUrl = getTargetUrl(context)
        toClientResponse.headers['proxy-content'] = encodeURI(targetUrl);
        if (last) {
            await this.remoteContentService.pipe({
                req, res,recordResponse, actualRequestData, toClientResponse, proxyInfo
            })
        } else {
            await this.remoteContentService.cache({
                req, recordResponse, actualRequestData, toClientResponse, proxyInfo
            })
        }
    }
}
