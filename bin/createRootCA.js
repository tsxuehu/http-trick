const { createRootSecurityContext } = require("../src/utils/cert");
const fileUtils = require("../src/utils/file");

let { keyPem, certPem } = createRootSecurityContext();

// 写文件
fileUtils.writeFile("root.crt.pem", keyPem);
fileUtils.writeFile("root.key.pem", certPem);
