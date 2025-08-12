/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
import trim from 'lodash/trim';
import keys from 'lodash/keys';
import { assertAxiosRes } from './utils.ts';
/**
 * 创建规则文件
 */
export async function createFile(name: string, description: string) {
  const response = await axios.post('/rule/create', {
    name: name,
    description: description,
  });
  assertAxiosRes(response);
  return response.data.data;
}

/**
 * 获取规则文件列表
 */
export async function getFileList() {
  const response = await axios.get('/rule/filelist');
  assertAxiosRes(response);
  return response.data.data;
}

export async function deleteFile(id: string) {
  const response = await axios.get(`/rule/deletefile?id=${id}`);
  assertAxiosRes(response);
}

export async function setFileCheckStatus(id: string, checked: boolean) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
  assertAxiosRes(response);
}

export async function saveRuleFile(id: string, content: any) {
  const response = await axios.post(`/rule/saveRuleFile?id=${id}`, content);
  assertAxiosRes(response);
}

export async function testRule(content: any) {
  const response = await axios.post('/rule/test', content);
  assertAxiosRes(response);
  return response.data.data;
}

export async function getFileContent(id: string) {
  const response = await axios.get(`/rule/getfile?id=${id}`);
  assertAxiosRes(response);
  return response.data.data;
}
export async function setRuleCheckedState(ruleFileId: string, ruleId: string, checked: boolean) {
  const response = await axios.get(`/rule/setRuleCheckedState`, {
    params: {
      ruleFileId,
      ruleId,
      checked: checked ? 1 : 0,
    },
  });
  assertAxiosRes(response);
}

export async function saveRule(ruleFileId: string, rule: any) {
  const response = await axios.post(`/rule/saveRule`, rule, {
    params: {
      ruleFileId,
    },
  });
  assertAxiosRes(response);
}

export async function removeRule(ruleFileId: string, ruleId: string) {
  const response = await axios.get(`/rule/removeRule`, {
    params: {
      ruleFileId,
      ruleId,
    },
  });
  assertAxiosRes(response);
}
