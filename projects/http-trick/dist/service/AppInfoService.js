"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const annotation_1 = require("di/annotation");
let AppInfoService = class AppInfoService {
    isSingle() {
        return true;
    }
};
AppInfoService = tslib_1.__decorate([
    (0, annotation_1.Service)()
], AppInfoService);
exports.default = AppInfoService;
//# sourceMappingURL=AppInfoService.js.map