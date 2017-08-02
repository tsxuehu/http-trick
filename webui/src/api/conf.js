/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
export default {
  getFileContent(){
    return axios.get('/conf/getfile');
  },
  saveFile(content){
    return axios.post('/conf/savefile', content);
  },
  disableRule(){
    return axios.post(`/conf/setRuleState`);
  },
  enableRule(){
    return axios.post(`/conf/setRuleState?rulestate=1`);
  }
}
