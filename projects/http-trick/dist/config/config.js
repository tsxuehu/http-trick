"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlPrefix = exports.env = void 0;
require("dotenv/config");
exports.env = {
    isDev: process.env.NODE_ENV === 'development',
};
exports.UrlPrefix = '/fe';
//# sourceMappingURL=config.js.map