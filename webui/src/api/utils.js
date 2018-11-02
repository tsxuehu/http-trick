/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';

var api = {


    getRemoteRuleFile(url) {
        return axios.get(`/utils/getGitlabFile?url=${encodeURIComponent(url)}`);
    },

    getGatewayMachine() {
        return axios.get('/utils/gateway/get-machine');
    },
    getConfigInfo(deviceId) {
        return axios.get(`/utils/gateway/config?deviceId=${deviceId}`);
    },
    setGateWay(deviceId, config){
        return axios.post(`/utils/gateway/set?deviceId=${deviceId}`, config);
    },
};

export default api;
