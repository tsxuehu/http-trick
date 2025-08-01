/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';

/**
 * 创建规则文件
 */
export function createFile(name:string, description:string) {
  return axios.post('/host/create', {
    name: name,
    description: description
  });
}

/**
 * 获取规则文件列表
 */
export function getFileList() {
  return axios.get('/host/filelist');
}

export function deleteFile(id:string) {
  return axios.get(`/host/deletefile?id=${id}`);
}

export async function useFile(id:string) {
  const response = await axios.get(`/host/usefile?id=${id}`);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}

export function getFileContent(id:string) {
  return axios.get(`/host/getfile?id=${id}`);
}

export function saveFile(id:string, content: any) {
  return axios.post(`/host/savefile?id=${id}`, content);
}
