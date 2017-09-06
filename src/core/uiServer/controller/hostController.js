import Repository from "../../repository";

export default class HostController {
    constructor() {

        this.hostRepository = Repository.getHostRepository();

    }

    regist(router) {

        //{
        //    name:name,
        //    description:description
        //}
        router.post('/host/create', async (ctx, next) => {
            let userId = ctx.userId;

            let result = await this.hostRepository.createHostFile(userId, ctx.request.body.name
                , ctx.request.body.description);
            ctx.body = {
                code: result ? 0 : 1,
                msg: result ? '' : '文件已存在'
            };
        });
        router.get('/host/filelist', async (ctx, next) => {
            let userId = ctx.userId;
            let hostList = await this.hostRepository.getHostFileList(userId);
            ctx.body = {
                code: 0,
                list: hostList
            };
        });
        // /host/deletefile?name=${name}
        router.get('/host/deletefile', (ctx, next) => {
            let userId = ctx.userId;
            this.hostRepository.deleteHostFile(userId, ctx.query.name);
            ctx.body = {
                code: 0
            };
        });
        // /host/usefile?name=${name}
        router.get('/host/usefile', (ctx, next) => {
            let userId = ctx.userId;
            this.hostRepository.setUseHost(userId, ctx.query.name);
            ctx.body = {
                code: 0
            };
        });
        // /host/getfile?name=${name}
        router.get('/host/getfile', async (ctx, next) => {
            let userId = ctx.userId;
            let hostFile = await this.hostRepository.getHostFile(userId, ctx.query.name);
            ctx.body = {
                code: 0,
                data: hostFile
            };
        });
        // /host/savefile?name=${name} ,content
        router.post('/host/savefile', (ctx, next) => {
            let userId = ctx.userId;
            this.hostRepository.saveHostFile(userId, ctx.query.name, ctx.request.body);
            ctx.body = {
                code: 0
            };
        });
    }
}