import fs from 'fs';
import  path from 'path';

router.get('/res/get', function*(next) {
    var saveResponseDirPath = dc.getSaveResponseDirPath();

    var id = this.query.idx;
    var filepath = path.join(saveResponseDirPath, id + '_res_body');
    fs.existsSync(filepath) && (this.body = fs.createReadStream(filepath));
});