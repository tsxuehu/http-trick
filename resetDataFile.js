const fileUtils = require("./src/core/utils/file");
const AppInfoService = require("./src/impl/file/appInfoService");
const path = require("path");
/**
 * 初始化脚本
 * @param force
 * @returns {Promise.<void>}
 */
async function resetData(force = false) {
    let appInfoService = new AppInfoService();
    let proxyDataDir = appInfoService.getProxyDataDir();

    await createDir(proxyDataDir);
    await createDir(path.join(proxyDataDir, "certificate"));
    await createDir(path.join(proxyDataDir, "host"));
    await createDir(path.join(proxyDataDir, "rule"));
    await createDir(path.join(proxyDataDir, "breakpoint"));
    await createDir(path.join(proxyDataDir, "mock-data"));
    await createDir(path.join(proxyDataDir, "mock-list"));
    await createDir(path.join(proxyDataDir, "profile"));
    await createDir(path.join(proxyDataDir, "filter"));
    await createDir(path.join(proxyDataDir, "traffic"));

    await resetFile(path.join(proxyDataDir, "deviceInfo.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "configure.json"), {}, force);
}

async function resetFile(path, data, force) {
    if (force) {
        await fileUtils.writeJsonToFile(path, data);
    } else {
        let exists = await fileUtils.exists(path);
        if (!exists) {
            await fileUtils.writeJsonToFile(path, data);
        }
    }
}

async function createDir(path) {
    let exists = await fileUtils.exists(path);
    if (!exists) {
        await fileUtils.makeDir(path);
    }
}

// sudo npm i -g http-trick安装时，执行postinstall脚本的用户的身份是啥？

module.exports = resetData;
resetData()
