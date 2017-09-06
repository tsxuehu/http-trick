/**
 * Created by tsxuehu on 4/11/17.
 */

var axios = require('axios');
exports.getEtag = function (url, gitlabToken, callback) {

    axios({
        method: 'Head',
        url: url,
        headers: {
            'PRIVATE-TOKEN': gitlabToken || ''
        }
    }).then(function (res) {
        callback && callback(res.headers['etag']);
    }).catch(function (error) {

    });
};

exports.getContent = function (url, gitlabToken) {
    return axios({
        method: 'Get',
        url: url,
        headers: {
            'PRIVATE-TOKEN': gitlabToken || ''
        }
    });
};

exports.api = function (url, method, data, gitlabToken) {
    return axios({
        method: method || 'Get',
        url: url,
        headers: {
            'PRIVATE-TOKEN': gitlabToken || ''
        },
        data: data || {}
    })
}