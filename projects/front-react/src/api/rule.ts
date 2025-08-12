/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios'
import trim from 'lodash/trim'
import keys from 'lodash/keys'
import { assertAxiosRes } from './utils.ts'

/**
 * 创建规则文件
 */
export function createFile(name: string, description: string) {
  return axios.post('/rule/create', {
    name: name,
    description: description,
  })
}

/**
 * 获取规则文件列表
 */
export function getFileList() {
  return axios.get('/rule/filelist')
}

export async function deleteFile(id: string) {
  const response = await axios.get(`/rule/deletefile?id=${id}`)
  assertAxiosRes(response)
}

export async function setFileCheckStatus(id: string, checked: boolean) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`)
  assertAxiosRes(response)
}

export function getFileContent(id: string) {
  return axios.get(`/rule/getfile?id=${id}`)
}

export function removeRule(ruleFileId: string, ruleId: string) {
  return axios.get(`/rule/removeRule`, {
    params: {
      ruleFileId,
      ruleId,
    },
  })
}

export function setRuleCheckedState(ruleFileId: string, ruleId: string, checked: boolean) {
  return axios.get(`/rule/setRuleCheckedState`, {
    params: {
      ruleFileId,
      ruleId,
      checked: checked ? 1 : 0,
    },
  })
}

export function saveRule(ruleFileId: string, rule: any) {
  return axios.post(`/rule/saveRule`, rule, {
    params: {
      ruleFileId,
    },
  })
}

export async function saveRuleFile(id: string, content: any) {
  const response = await axios.post(`/rule/saveRuleFile?id=${id}`, content)
  assertAxiosRes(response)
}

export async function testRule(content: any) {
  const response = await axios.post('/rule/test', content)
  assertAxiosRes(response)
  return response.data.data
}
