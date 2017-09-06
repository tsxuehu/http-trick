import Repository from "../../repository";

export default class HostController {
    regist(router) {
        let _hostRepository = Repository.getHostRepository();

        //{
        //    name:name,
        //    description:description
        //}
        router.post('/host/create', (ctx, next)=> {
            let userId = ctx.userId;

            let result = _hostRepository.createHostFile(userId, this.request.body.name
                , this.request.body.description);
            this.body = {
                code: result ? 0 : 1,
                msg: result ? '' : '文件已存在'
            };
        });
        router.get('/host/filelist', (ctx, next)=> {
            let userId = ctx.userId;

            this.body = {
                code: 0,
                list: _hostRepository.getHostFileList(userId)
            };
        });
        // /host/deletefile?name=${name}
        router.get('/host/deletefile', (ctx, next)=> {
            let userId = ctx.userId;
            _hostRepository.deleteHostFile(userId, this.query.name);
            this.body = {
                code: 0
            };
        });
        // /host/usefile?name=${name}
        router.get('/host/usefile', (ctx, next)=> {
            let userId = ctx.userId;
            _hostRepository.setUseHost(userId, this.query.name);
            this.body = {
                code: 0
            };
        });
        // /host/getfile?name=${name}
        router.get('/host/getfile', (ctx, next)=> {
            let userId = ctx.userId;
            this.body = {
                code: 0,
                data: _hostRepository.getHostFile(userId, this.query.name)
            };
        });
        // /host/savefile?name=${name} ,content
        router.post('/host/savefile', (ctx, next)=> {
            let userId = ctx.userId;
            _hostRepository.saveHostFile(userId, this.query.name, this.request.body);
            this.body = {
                code: 0
            };
        });
    }
}