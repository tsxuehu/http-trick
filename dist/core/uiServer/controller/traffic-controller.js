'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

router.get('/res/get', function* (next) {
    var saveResponseDirPath = dc.getSaveResponseDirPath();

    var id = this.query.idx;
    var filepath = _path2.default.join(saveResponseDirPath, id + '_res_body');
    _fs2.default.existsSync(filepath) && (this.body = _fs2.default.createReadStream(filepath));
});