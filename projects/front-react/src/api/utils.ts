/**
 * Created by tsxuehu on 17/1/9.
 */

import axios, { AxiosResponse } from "axios";

export function getRemoteFile(url: string) {
  return axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`);
}

export function assertAxiosRes(response: AxiosResponse ) {
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}
