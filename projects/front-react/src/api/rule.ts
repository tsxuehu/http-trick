/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from "axios";
import trim from "lodash/trim";
import keys from "lodash/keys";

/**
 * 创建规则文件
 */
export function createFile(name: string, description: string) {
  return axios.post("/rule/create", {
    name: name,
    description: description
  });
}

/**
 * 获取规则文件列表
 */
export function getFileList() {
  return axios.get("/rule/filelist");
}

export function deleteFile(id: string) {
  return axios.get(`/rule/deletefile?id=${id}`);
}

export async function setFileCheckStatus(id: string, checked: boolean) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}

export function getFileContent(id: string) {
  return axios.get(`/rule/getfile?id=${id}`);
}

export function removeRule(ruleFileId: string, ruleId: string) {
  return axios.get(`/rule/removeRule`, {
    params: {
      ruleFileId, ruleId
    }
  });
}

export function setRuleCheckedState(ruleFileId: string, ruleId: string, checked: boolean) {
  return axios.get(`/rule/setRuleCheckedState`, {
    params: {
      ruleFileId,
      ruleId,
      checked: checked ? 1 : 0
    }
  });
}

export function saveRule(ruleFileId: string, rule: any) {
  return axios.post(`/rule/saveRule`, rule, {
    params: {
      ruleFileId
    }
  });
}

export function saveRuleFile(id: string, content: any) {
  return axios.post(`/rule/saveRuleFile?id=${id}`, content);
}

export function testRule(content: any) {
  return axios.post("/rule/test", content);
}

export function getReferenceVar(content: any) {
  var contentStr = JSON.stringify(content);
  var reg1 = RegExp("<%=(.+?)%>", "g");
  var reg2 = RegExp("\\$\\{(.+?)\\}", "g");
  var result;
  var varObj = {};
  while ((result = reg1.exec(contentStr)) != null) {
    // @ts-ignore
    varObj[trim(result[1])] = 1;
  }
  while ((result = reg2.exec(contentStr)) != null) {
    // @ts-ignore
    varObj[trim(result[1])] = 1;
  }
  return keys(varObj);
}

