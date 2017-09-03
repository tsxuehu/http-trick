"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("./action");

var _action2 = _interopRequireDefault(_action);

var _repository = require("../../repository");

var _repository2 = _interopRequireDefault(_repository);

var _local = require("../content/local");

var _local2 = _interopRequireDefault(_local);

var _addHeaderToResponse = require("../../utils/addHeaderToResponse");

var _addHeaderToResponse2 = _interopRequireDefault(_addHeaderToResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by tsxuehu on 17/3/19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


class MockData extends _action2.default {
    static getMockData() {}

    constructor() {
        super();
        this.mockDataRepository = _repository2.default.getMockDataRepository();
        this.local = _local2.default.getLocal();
    }

    willGetContent() {
        return true;
    }

    /**
     * 运行处理动作
     */
    run({
        req,
        res,
        urlObj,
        clientIp,
        rule, // 规则
        action, // 规则里的一个动作
        requestContent, // 请求内容
        extraRequestHeaders, // 请求头
        toClientResponse, //响应内容
        last = true
    }) {
        var _this = this;

        return _asyncToGenerator(function* () {
            // 获取数据文件id
            let dataId = action.data.dataId;
            let filepath = _this.mockDataRepository.getDataFilePath(clientIp, dataId);
            let contentType = _this.mockDataRepository.getDataFileContentType(clientIp, dataId);
            toClientResponse.headers['fe-proxy-content'] = encodeURI(filepath);
            if (last) {
                toClientResponse.sendedToClient = true;
                (0, _addHeaderToResponse2.default)(res, toClientResponse.headers);
                _this.local.pipe({
                    req,
                    res,
                    path: filepath,
                    contentType
                });
            } else {
                yield _this.local.pipe({
                    req,
                    res,
                    path: filepath,
                    toClientResponse,
                    contentType
                });
            }
        })();
    }
}
exports.default = MockData;