const {createRootSecurityContext} = require('../src/service/certificationService');
const fileUtils = require("../src/utils/file");

let {keyPem, certPem} = createRootSecurityContext();


// 写文件
fileUtils.writeFile('root.key', keyPem)
fileUtils.writeFile('root.cert', certPem)


