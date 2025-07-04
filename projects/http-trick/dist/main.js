"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("./module-hack");
require("reflect-metadata");
const log4js_1 = require("config/log4js");
const trace_1 = require("utils/trace");
const global_exception_1 = require("./global-exception");
const path_1 = tslib_1.__importDefault(require("path"));
const container_1 = require("di/container");
const global_var_1 = require("utils/global-var");
const fast_glob_1 = tslib_1.__importDefault(require("fast-glob"));
async function main() {
    (0, trace_1.initAsyncContext)();
    (0, log4js_1.configureLogger)();
    (0, global_exception_1.registerGlobalExceptionHandler)();
    const container = new container_1.Container();
    const dirList = [
        path_1.default.resolve(__dirname, 'controller'),
        path_1.default.resolve(__dirname, 'service'),
    ];
    for (const dir of dirList) {
        const jsFileList = await (0, fast_glob_1.default)(['**/*.js'], {
            cwd: dir,
        });
        for (const jsFile of jsFileList) {
            const obj = require(path_1.default.join(dir, jsFile));
            if (!isObject(obj) || !isObject(obj.default)) {
                continue;
            }
            const clazz = obj.default;
            clazz.jsFile = jsFile;
            container.registerServiceClazz(clazz);
        }
    }
    (0, global_var_1.setContainer)(container);
}
main();
//# sourceMappingURL=main.js.map