import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import AppInfoService from "service/AppInfoService";
import {Context, Next} from "koa";
import axios from "axios";
import CertificationService from "service/manage/CertificationService";

@Controller('/utils/')
export default class UtilsController {
    @Resource() private appInfoService: AppInfoService
    @Resource() private certificationService: CertificationService

    @Path('getRemoteFile', HttpMethod.GET)
    async getRemoteFile(ctx: Context, next: Next) {
        let url = ctx.query.url as string;
        let response = await axios.get(url);
        ctx.body = {
            code: 0,
            data: response.data
        };
    }

    @Path('rootCA.crt', HttpMethod.GET)
    async rootCA(ctx: Context, next: Next) {
        ctx.set('Content-disposition', 'attachment;filename=http-trick.crt');
        ctx.body = this.certificationService.getRootCACertPem();
    }
}
