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
    await createDir(path.join(proxyDataDir, "mock-data"));

    await resetFile(path.join(proxyDataDir, "breakpoints.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "clientIpUserMap.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "clientUserMap.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "configure.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "mockDataList.json"), {}, force);
    await resetFile(path.join(proxyDataDir, "profile.json"), {}, force);
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


resetData();