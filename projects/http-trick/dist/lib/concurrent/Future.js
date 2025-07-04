"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ral_1 = tslib_1.__importDefault(require("./ral"));
class Future {
    constructor(name = '') {
        this._isFinished = false;
        this._isRejected = false;
        this._isResolved = false;
        this.name = name;
        this.promise = new Promise((resolve, reject) => {
            this.resolveFn = resolve;
            this.rejectFn = reject;
        });
    }
    setTaskTimeout(time, err) {
        this.timeoutDisposable = (0, ral_1.default)().timer.setTimeout(() => {
            if (this._isFinished) {
                return;
            }
            const throwError = err || new Error(`Future超时: ${this.name}`);
            this.rejectFn(throwError);
        }, time);
        return this;
    }
    resolve(result) {
        this._isFinished = true;
        this._isResolved = true;
        this.timeoutDisposable?.dispose();
        this.resolveFn(result);
    }
    reject(error) {
        this._isFinished = true;
        this._isRejected = true;
        this.timeoutDisposable?.dispose();
        this.rejectFn(error);
    }
    isFinished() {
        return this._isFinished;
    }
    isResolved() {
        return this._isResolved;
    }
    isRejected() {
        return this._isRejected;
    }
    get() {
        return this.promise;
    }
    then(onfulfilled, onrejected) {
        this.promise.then(onfulfilled, onrejected);
    }
    static all(futures) {
        return Promise.all(futures.map((f) => f.get()));
    }
}
exports.default = Future;
//# sourceMappingURL=Future.js.map