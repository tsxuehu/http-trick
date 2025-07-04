/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
var api = {
    getAppInfo(){
        return axios.get('/app/get-info');
    },
};

export default  api;
