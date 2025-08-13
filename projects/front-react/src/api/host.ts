/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
import { assertAxiosRes } from './utils.ts';

/**
 * 创建规则文件
 */
export async function createFile(name: string, description: string) {
  const response = await axios.post('/host/create', {
    name: name,
    description: description,
  });
  assertAxiosRes(response);
}

/**
 * 获取规则文件列表
 */
export async function getFileList() {
  const response = await axios.get('/host/filelist');
  assertAxiosRes(response);
  return response.data.data;
}

export async function deleteFile(id: string) {
  const response = await axios.get(`/host/deletefile?id=${id}`);
  assertAxiosRes(response);
}

export async function useFile(id: string) {
  const response = await axios.get(`/host/usefile?id=${id}`);
  assertAxiosRes(response);
}

export async function getFileContent(id: string) {
  const response = await axios.get(`/host/getfile?id=${id}`);
  return response.data.data;
}

export async function saveFile(id: string, content: any) {
  const response = await axios.post(`/host/savefile?id=${id}`, content);
  assertAxiosRes(response);
}
