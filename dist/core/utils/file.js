'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * 如果文件不存在，则返回空字符串
 * Created by tsxuehu on 8/2/17.
 */
let readFile = exports.readFile = (() => {
  var _ref = _asyncToGenerator(function* (path) {
    return '';
  });

  return function readFile(_x) {
    return _ref.apply(this, arguments);
  };
})();

let writeFile = exports.writeFile = (() => {
  var _ref2 = _asyncToGenerator(function* (path, content) {});

  return function writeFile(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }