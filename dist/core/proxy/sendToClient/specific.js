'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ({ res, statusCode, headers, content, logKey }) {
    res.statusCode = statusCode || 200;
    var buffer = Buffer.from(content, 'utf-8');

    res.setHeader(logKey || 'fe-proxy-action', 'specific content');
    headers['Content-Length'] = buffer.length;
    headers['Access-Control-Allow-Origin'] = '*';
    _lodash2.default.forEach(headers, function (value, key) {
        res.setHeader(key, value);
    });

    res.end(buffer);
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by tsxuehu on 17/3/31.
 */
// 向客户端返回置顶内容
;