/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
import debounce from 'lodash/debounce';
import trim from 'lodash/trim';
import keys from 'lodash/keys';
var api = {
  /**
   * 创建规则文件
   */
  createFile(name, description){
    return axios.post('/rule/create', {
      name: name,
      description: description
    });
  },
  /**
   * 获取规则文件列表
   */
  getFileList(){
    return axios.get('/rule/filelist');
  },
  deleteFile(name){
    return axios.get(`/rule/deletefile?name=${name}`);
  },
  setFileCheckStatus(name, checked){
    return axios.get(`/rule/setfilecheckstatus?name=${name}&checked=${checked ? 1 : 0}`);
  },
  getFileContent(name){
    return axios.get(`/rule/getfile?name=${name}`);
  },
  saveFile(name, content){
    return axios.post(`/rule/savefile?name=${name}`, content);
  },

  testRule(content){
    return axios.post('/rule/test', content);
  },

  getReferenceVar(content) {
    var contentStr = JSON.stringify(content);
    var reg = RegExp("<%=(.+?)%>", 'g');
    var result;
    var varObj = {};
    while ((result = reg.exec(contentStr)) != null) {
      varObj[trim(result[1])] = 1;
    }
    return keys(varObj);
  }

};

// 构造debounce函数
api.debouncedSaveFile = debounce(function (name, content, callback) {
    api.saveFile(name, content).then((response) => {
        callback(response)
    });
}, 3000);
export default api;
