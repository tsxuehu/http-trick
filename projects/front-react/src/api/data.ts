/**
 * Created by tsxuehu on 17/1/9.
 */
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

export function getDataList() {
    return axios.get('/data/getdatalist');
}

export function removeDataFile(content: any) {
    return axios.post('/data/removedatafile', content);
}

export function createDataFile(content: any) {
    return axios.post('/data/createdatafile', content);
}

export function getDataFile(id: string) {
    return axios.get(`/data/getdatafile?id=${id}`);
}

// 保存版本数据
export function saveDataFile(id: string, content: any) {
    var data = new FormData();
    data.append('content', content);
    return axios.post(`/data/savedatafile?id=${id}`, data);
}

export function saveDataEntryFromTraffic(reqId: string, name: string, contenttype: string) {
    return axios.post('/data/savedatafromtraffic', {
        id: uuidv4(),
        name: name,
        contenttype: contenttype,
        reqid: reqId
    });
}
