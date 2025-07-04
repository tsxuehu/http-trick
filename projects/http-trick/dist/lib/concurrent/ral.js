"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ral = Object.freeze({
    timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
            const handle = setTimeout(callback, ms, ...args);
            return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
            if (typeof setImmediate != 'undefined') {
                const handle = setImmediate(callback, ...args);
                return { dispose: () => clearImmediate(handle) };
            }
            else {
                const handle = setTimeout(callback, 0, ...args);
                return { dispose: () => clearTimeout(handle) };
            }
        },
        setInterval(callback, ms, ...args) {
            const handle = setInterval(callback, ms, ...args);
            return { dispose: () => clearInterval(handle) };
        },
    }),
    idle: {
        requestIdleCallback(cb, options) {
            if (typeof requestIdleCallback !== 'undefined') {
                const id = requestIdleCallback(cb, options);
                return { dispose: () => cancelIdleCallback(id) };
            }
            else {
                const start = Date.now();
                const id = setTimeout(function () {
                    cb({
                        didTimeout: false,
                        timeRemaining: function () {
                            return Math.max(0, 50 - (Date.now() - start));
                        },
                    });
                }, 1);
                return { dispose: () => clearTimeout(id) };
            }
        },
    },
});
function RAL() {
    if (_ral === undefined) {
        throw new Error(`No runtime abstraction layer installed`);
    }
    return _ral;
}
exports.default = RAL;
//# sourceMappingURL=ral.js.map