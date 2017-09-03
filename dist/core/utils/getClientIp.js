'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
};