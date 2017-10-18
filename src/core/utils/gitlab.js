/**
 * Created by tsxuehu on 4/11/17.
 */

const axios = require('axios');
module.exports.getEtag = function getEtag(url, gitlabToken, callback) {

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

module.exports.getContent = function getContent(url, gitlabToken) {
    return axios({
        method: 'Get',
        url: url,
        headers: {
            'PRIVATE-TOKEN': gitlabToken || ''
        }
    });
};
/**
 * 调用gitlab的接口
 * @param url
 * @param method
 * @param data
 * @param gitlabToken
 * @returns {AxiosPromise}
 */
module.exports.api = function api(url, method, data, gitlabToken) {
    return axios({
        method: method || 'Get',
        url: url,
        headers: {
            'PRIVATE-TOKEN': gitlabToken || ''
        },
        data: data || {}
    })
}