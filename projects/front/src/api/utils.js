/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';

var api = {

    getRemoteFile(url) {
        return axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`);
    }
};

export default api;
