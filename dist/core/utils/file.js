"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 如果文件不存在，则返回空字符串
 * Created by tsxuehu on 8/2/17.
 */
function readFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return '';
    });
}
exports.readFile = readFile;
function writeFile(path, content) {
    return __awaiter(this, void 0, void 0, function* () {});
}
exports.writeFile = writeFile;