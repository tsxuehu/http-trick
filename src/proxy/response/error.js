/**
 * Created by tsxuehu on 17/3/31.
 */
// 向客户端返回错误

module.exports = function (req, res, statusCode, reason) {
    res.statusCode = statusCode || 500;
    res.setHeader('Content-Length', 0);
    res.setHeader('fe-proxy-reason', encodeURI(reason));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end();
};