/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
import trim from 'lodash/trim';
import keys from 'lodash/keys';

/**
 * 创建规则文件
 */
export function createFile(name, description) {
  return axios.post('/rule/create', {
    name: name,
    description: description
  });
}

/**
 * 获取规则文件列表
 */
export function getFileList() {
  return axios.get('/rule/filelist');
}

export function deleteFile(id) {
  return axios.get(`/rule/deletefile?id=${id}`);
}

export function setFileCheckStatus(id, checked) {
  return axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
}

export function getFileContent(id) {
  return axios.get(`/rule/getfile?id=${id}`);
}

export function removeRule(ruleFileId, ruleId) {
  return axios.get(`/rule/removeRule`, {
    params: {
      ruleFileId, ruleId
    }
  });
}

export function setRuleCheckedState(ruleFileId, ruleId, checked) {
  return axios.get(`/rule/setRuleCheckedState`, {
    params: {
      ruleFileId,
      ruleId,
      checked: checked ? 1 : 0
    }
  });
}

export function saveRule(ruleFileId, rule) {
  return axios.post(`/rule/saveRule`, rule, {
    params: {
      ruleFileId
    }
  });
}

export function saveRuleFile(id, content) {
  return axios.post(`/rule/saveRuleFile?id=${id}`, content);
}

export function testRule(content) {
  return axios.post('/rule/test', content);
}

export function getReferenceVar(content) {
  var contentStr = JSON.stringify(content);
  var reg = RegExp("<%=(.+?)%>", 'g');
  var result;
  var varObj = {};
  while ((result = reg.exec(contentStr)) != null) {
    varObj[trim(result[1])] = 1;
  }
  return keys(varObj);
}

