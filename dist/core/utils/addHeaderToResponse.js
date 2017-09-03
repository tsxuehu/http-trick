'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = addHeaderToResponse;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addHeaderToResponse(response, headers) {
    _lodash2.default.forEach(headers, (value, key) => {
        response.setHeader(key, value);
    });
}