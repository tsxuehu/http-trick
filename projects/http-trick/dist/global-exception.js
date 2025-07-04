"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGlobalExceptionHandler = registerGlobalExceptionHandler;
const tslib_1 = require("tslib");
const log4js_1 = tslib_1.__importDefault(require("log4js"));
const logger = log4js_1.default.getLogger("global-exception");
function registerGlobalExceptionHandler() {
    process.on("SIGINT", async () => {
        logger.warn('退出：SIGINT');
        process.exit();
    });
    process.on("uncaughtException", function (err) {
        logger.error(err);
    });
    process.on('unhandledRejection', (reason, p) => {
        logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    });
}
//# sourceMappingURL=global-exception.js.map