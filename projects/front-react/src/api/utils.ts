/**
 * Created by tsxuehu on 17/1/9.
 */

import axios, { AxiosResponse } from 'axios'

export async function getRemoteFile(url: string) {
  const response = await axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`)
  assertAxiosRes(response)
  return response.data.data
}

export function assertAxiosRes(response: AxiosResponse) {
  const serverData = response.data
  if (serverData.code !== 0) {
    throw new Error(serverData.msg)
  }
}
