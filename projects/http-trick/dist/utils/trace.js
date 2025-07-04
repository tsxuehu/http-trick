"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAsyncContext = initAsyncContext;
exports.runInAsyncContext = runInAsyncContext;
exports.getTraceId = getTraceId;
const async_hooks_1 = require("async_hooks");
const random_1 = require("./random");
let asyncLocalStorage;
function initAsyncContext() {
    asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
}
async function runInAsyncContext(source, callback) {
    await asyncLocalStorage.run({
        traceId: `tc-${source}-${(0, random_1.uniqueId)()}`
    }, () => {
        return callback();
    });
}
function getTraceId() {
    return asyncLocalStorage.getStore()?.traceId || 'no-trace';
}
//# sourceMappingURL=trace.js.map