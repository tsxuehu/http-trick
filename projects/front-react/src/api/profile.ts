/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from "axios";

export async function saveFile(content: any) {
  const response = await axios.post("/profile/savefile", content);
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}

export function disableRule() {
  return axios.post(`/profile/setRuleState`);
}

export function enableRule() {
  return axios.post(`/profile/setRuleState?rulestate=1`);
}

export function disableResolveHost() {
  return axios.post(`/profile/setResolveHost`);
}

export function enableResolveHost() {
  return axios.post(`/profile/setResolveHost?resolve=1`);
}

export function disableHost() {
  return axios.post(`/profile/setHostState`);
}

export function enableHost() {
  return axios.post(`/profile/setHostState?hoststate=1`);
}

export function disableFilter() {
  return axios.post(`/profile/setFilterState`);
}

export function enableFilter() {
  return axios.post(`/profile/setFilterState?filterstate=1`);
}

export async function getUserId(): Promise<string> {
  const result =  await axios.get(`/profile/getUserId`);
  return result.data.data.userId;
}

export function getUserInfo() {
  return axios.get(`/profile/getUserInfo`);
}

export function setUserId(userId: string) {
  return axios.get(`/profile/setUserId?userId=${userId}`);
}

export function unBind(id: string) {
  return axios.get(`/profile/device/unbind?deviceId=${id}`);
}

export function setDeviceName(deviceId: string, name: string) {
  return axios.get(`/profile/device/setName?deviceId=${deviceId}&name=${encodeURI(name)}`);
}

export function disableMonitor(deviceId: string) {
  return axios.get(`/profile/device/disableMonitor?deviceId=${deviceId}`);
}

export function deviceUseHost(deviceId: string, hostname: string) {
  return axios.get(`/profile/device/usehost?deviceId=${deviceId}&hostname=${encodeURI(hostname)}`);
}

export function enableMonitor(deviceId: string) {
  return axios.get(`/profile/device/enableMonitor?deviceId=${deviceId}`);
}

export function setExternalProxy(deviceId: string, proxy: any) {
  proxy.deviceId = deviceId;
  return axios.post("/profile/device/externalProxy", proxy);
}

