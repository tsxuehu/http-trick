import fs from 'fs';
import  path from 'path';

export default class TrafficController {
    regist(router){
        router.get('/res/get', function*(next) {
            var saveResponseDirPath = dc.getSaveResponseDirPath();

            var id = this.query.idx;
            var filepath = path.join(saveResponseDirPath, id + '_res_body');
            fs.existsSync(filepath) && (this.body = fs.createReadStream(filepath));
        });
    }
}