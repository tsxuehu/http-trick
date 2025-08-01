/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from "axios";


export function getRemoteFile(url: string) {
  return axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`);
}
