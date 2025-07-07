import BaseAction from "service/intercept/action/BaseAction";
import {Resource, Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import ProfileService from "service/manage/ProfileService";
import HostResolveService from "service/intercept/HostResolveService";
import ConfigureService from "service/manage/ConfigureService";


@Service()
export class BypassAction extends BaseAction {

    @Resource() private profileService: ProfileService
    @Resource() private hostResolveService: HostResolveService
    @Resource() private configureService: ConfigureService

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
        // 查找当前用户是否有流量监控窗
        // 若有监控窗，则将返回浏览器的内容放入 toClientResponse
        if (context.toClientResponse.hasContent) {
            await this.bypassWithRequestContent(context, extraInfo);
        } else {
            await this.bypass(context, extraInfo);
        }
    }

    async bypass(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {urlObj, actualRequestQuery, additionalRequestQuery} = context;
        const {protocol, hostname, pathname, port, search} = urlObj;

        // 构造path
        let finialPath: string = pathname;
        try {
            const params = new URLSearchParams(search)
            for (const [key, value] of params.entries()) {
                actualRequestQuery[key] = value;
            }
            if (Object.keys(additionalRequestQuery).length > 0) {
                Object.assign(actualRequestQuery, additionalRequestQuery);
                const newParams = new URLSearchParams(actualRequestQuery)
                finialPath = `${pathname}?${newParams.toString()}`;
            }
        } catch (e) {
        }
    }

    async bypassWithRequestContent(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
    }
}