/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';
import { assertAxiosRes } from './utils.ts';

export async function saveFile(content: any) {
  const response = await axios.post('/profile/savefile', content);
  assertAxiosRes(response);
}

export async function disableRule() {
  const response = await axios.post(`/profile/setRuleState`);
  assertAxiosRes(response);
}

export async function enableRule() {
  const response = await axios.post(`/profile/setRuleState?rulestate=1`);
  assertAxiosRes(response);
}

export async function disableResolveHost() {
  const response = await axios.post(`/profile/setResolveHost`);
  assertAxiosRes(response);
}

export async function enableResolveHost() {
  const response = await axios.post(`/profile/setResolveHost?resolve=1`);
  assertAxiosRes(response);
}

export async function disableHost() {
  const response = await axios.post(`/profile/setHostState`);
  assertAxiosRes(response);
}

export async function enableHost() {
  const response = await axios.post(`/profile/setHostState?hoststate=1`);
  assertAxiosRes(response);
}

export async function disableFilter() {
  const response = await axios.post(`/profile/setFilterState`);
  assertAxiosRes(response);
}

export async function enableFilter() {
  const response = await axios.post(`/profile/setFilterState?filterstate=1`);
  assertAxiosRes(response);
}

export async function getUserId(): Promise<string> {
  const response = await axios.get(`/profile/getUserId`);
  assertAxiosRes(response);
  return response.data.data.userId;
}

export async function getUserInfo() {
  const response = await axios.get(`/profile/getUserInfo`);
  assertAxiosRes(response);
}

export async function setUserId(userId: string) {
  const response = await axios.get(`/profile/setUserId?userId=${userId}`);
  assertAxiosRes(response);
}

export async function unBind(id: string) {
  const response = await axios.get(`/profile/device/unbind?deviceId=${id}`);
  assertAxiosRes(response);
}

export async function setDeviceName(deviceId: string, name: string) {
  const response = await axios.get(`/profile/device/setName?deviceId=${deviceId}&name=${encodeURI(name)}`);
  assertAxiosRes(response);
}

export async function disableMonitor(deviceId: string) {
  const response = await axios.get(`/profile/device/disableMonitor?deviceId=${deviceId}`);
  assertAxiosRes(response);
}

export async function deviceUseHost(deviceId: string, hostname: string) {
  const response = await axios.get(`/profile/device/usehost?deviceId=${deviceId}&hostname=${encodeURI(hostname)}`);
  assertAxiosRes(response);
}

export async function enableMonitor(deviceId: string) {
  const response = await axios.get(`/profile/device/enableMonitor?deviceId=${deviceId}`);
  assertAxiosRes(response);
}

export async function setExternalProxy(deviceId: string, proxy: any) {
  proxy.deviceId = deviceId;
  const response = await axios.post('/profile/device/externalProxy', proxy);
  assertAxiosRes(response);
}
