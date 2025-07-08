import {Controller, Path, Resource} from "di/annotation";
import {HttpMethod} from "di/meta-utils";
import {Context, Next} from "koa";
import ProfileService from "service/manage/ProfileService";
import {RuleDataService} from "service/manage/RuleDataService";

@Controller('/rule/')
export default class RuleController {
    @Resource() private profileService: ProfileService
    @Resource() private ruleDataService: RuleDataService

    @Path('create', HttpMethod.POST)
    async create(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {name, description} = ctx.request.body;
        let ruleFileId = await this.ruleDataService.createRuleFile(userId, name, description);
        ctx.body = {
            code: 0,
            msg: 'ok',
            data: {
                id: ruleFileId
            }
        };
    }

    @Path('filelist', HttpMethod.GET)
    async filelist(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let ruleFileList = this.ruleDataService.getRuleFileList(userId);
        ctx.body = {
            code: 0,
            list: ruleFileList
        };
    }

    @Path('deletefile', HttpMethod.GET)
    async deletefile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.ruleDataService.deleteRuleFile(userId, ctx.query.id);
        ctx.body = {
            code: 0
        };
    }

    @Path('setfilecheckstatus', HttpMethod.GET)
    async setfilecheckstatus(ctx: Context, next: Next) {
        let userId = ctx.userId;
        this.ruleDataService.setRuleFileCheckStatus(userId, ctx.query.id,
            ctx.query.checked == 1 ? true : false);
        ctx.body = {
            code: 0
        };
    }

    @Path('getfile', HttpMethod.GET)
    async getfile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let content = this.ruleDataService.getRuleFile(userId, ctx.query.id);
        ctx.body = {
            code: 0,
            data: content
        };
    }

    @Path('file/raw', HttpMethod.GET)
    async fileFaw(ctx: Context, next: Next) {
        let userId = ctx.userId;
        ctx.body = this.ruleDataService.getRuleFile(userId, ctx.query.id);
    }

    @Path('saveRule', HttpMethod.POST)
    async saveRule(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.ruleDataService.saveRule(userId, ctx.query.ruleFileId, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('setRuleCheckedState', HttpMethod.GET)
    async setRuleCheckedState(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {ruleFileId, ruleId, checked} = ctx.query;
        await this.ruleDataService.setRuleCheckedState(userId, ruleFileId, ruleId, checked == 1);
        ctx.body = {
            code: 0
        };
    }

    @Path('removeRule', HttpMethod.GET)
    async removeRule(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {ruleFileId, ruleId} = ctx.query;
        await this.ruleDataService.removeRule(userId, ruleFileId, ruleId);
        ctx.body = {
            code: 0
        };
    }


    @Path('saveRuleFile', HttpMethod.POST)
    async saveRuleFile(ctx: Context, next: Next) {
        let userId = ctx.userId;
        await this.ruleDataService.saveRuleFile(userId, ctx.query.id, ctx.request.body);
        ctx.body = {
            code: 0
        };
    }

    @Path('download', HttpMethod.GET)
    async download(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let id = ctx.query.id;
        let content = this.ruleDataService.getRuleFile(userId, id);
        ctx.set('Content-disposition', `attachment;filename=${encodeURIComponent(content.name)}.json`);
        ctx.body = content;
    }

    @Path('test', HttpMethod.POST)
    async test(ctx: Context, next: Next) {
        let userId = ctx.userId;
        let {
            requestMethod,// 请求method
            requestUrl,// 请求url
            matchMethod,// 匹配method
            matchUrl,// 匹配url
            target, // 转发末班
        } = ctx.request.body;

        let matchResult = '不匹配';
        let redirectResult;
        let message = '';

        let urlMatch = matchUrl && (requestUrl.indexOf(matchUrl) >= 0 || (new RegExp(matchUrl)).test(requestUrl));
        let methodMatch = !matchMethod || (requestMethod.toLowerCase().trim()) == (matchMethod.toLowerCase().trim());
        if (urlMatch && methodMatch) {
            matchResult = 'url匹配通过';
        }

        redirectResult = await this.profileService.calcPath(userId, requestUrl, matchUrl, target);

        // 测试规则
        ctx.body = {
            code: 0,
            data: {
                matchResult,
                redirectResult,
                message
            }
        };
    }

}
