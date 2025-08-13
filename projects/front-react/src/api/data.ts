/**
 * Created by tsxuehu on 17/1/9.
 */
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { assertAxiosRes } from './utils.ts';

export async function getDataList() {
  const response = await axios.get('/data/getdatalist');
  assertAxiosRes(response);
  return response.data.data;
}

export async function removeDataFile(content: any) {
  const response = await axios.post('/data/removedatafile', content);
  assertAxiosRes(response);
}

export async function createDataFile(content: any) {
  const response = await axios.post('/data/createdatafile', content);
  assertAxiosRes(response);
}

export async function getDataFile(id: string) {
  const response = await axios.get(`/data/getdatafile?id=${id}`);
  assertAxiosRes(response);
  return response.data.data;
}

// 保存版本数据
export async function saveDataFile(id: string, content: any) {
  var data = new FormData();
  data.append('content', content);
  const response = await axios.post(`/data/savedatafile?id=${id}`, data);
  assertAxiosRes(response);
}

export async function saveDataEntryFromTraffic(reqId: string, name: string, contenttype: string) {
  const response = await axios.post('/data/savedatafromtraffic', {
    id: uuidv4(),
    name: name,
    contenttype: contenttype,
    reqid: reqId,
  });
  assertAxiosRes(response);
}
