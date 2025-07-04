/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';

/**
 * 创建规则文件
 */
export function createFile(name, description) {
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

export function deleteFile(id) {
  return axios.get(`/host/deletefile?id=${id}`);
}

export function useFile(id) {
  return axios.get(`/host/usefile?id=${id}`);
}

export function getFileContent(id) {
  return axios.get(`/host/getfile?id=${id}`);
}

export function saveFile(id, content) {
  return axios.post(`/host/savefile?id=${id}`, content);
}
