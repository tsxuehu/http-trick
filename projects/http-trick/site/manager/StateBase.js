import { K as axios, V as createStore } from "./vendor.js";
async function getRemoteFile(url) {
  const response = await axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`);
  assertAxiosRes(response);
  return response.data.data;
}
function assertAxiosRes(response) {
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}
async function saveFile(content) {
  const response = await axios.post("/profile/savefile", content);
  assertAxiosRes(response);
}
async function disableRule() {
  const response = await axios.post(`/profile/setRuleState`);
  assertAxiosRes(response);
}
async function enableRule() {
  const response = await axios.post(`/profile/setRuleState?rulestate=1`);
  assertAxiosRes(response);
}
async function disableResolveIp() {
  const response = await axios.post(`/profile/setResolveIp`);
  assertAxiosRes(response);
}
async function enableResolveIp() {
  const response = await axios.post(`/profile/setResolveIp?resolve=1`);
  assertAxiosRes(response);
}
async function disableHost() {
  const response = await axios.post(`/profile/setHostState`);
  assertAxiosRes(response);
}
async function enableHost() {
  const response = await axios.post(`/profile/setHostState?hoststate=1`);
  assertAxiosRes(response);
}
async function disableFilter() {
  const response = await axios.post(`/profile/setFilterState`);
  assertAxiosRes(response);
}
async function enableFilter() {
  const response = await axios.post(`/profile/setFilterState?filterstate=1`);
  assertAxiosRes(response);
}
async function getUserId() {
  const response = await axios.get(`/profile/getUserId`);
  assertAxiosRes(response);
  return response.data.data.userId;
}
async function getUserInfo() {
  const response = await axios.get(`/profile/getUserInfo`);
  assertAxiosRes(response);
  return response.data.data;
}
class StateBase {
  __store;
  constructor(initialState) {
    this.__store = createStore((set) => initialState);
  }
  setState(partial) {
    this.__store.setState(partial);
  }
  getState() {
    return this.__store.getState();
  }
  subscribe(listener) {
    listener(this.__store.getState());
    return this.__store.subscribe(listener);
  }
}
export {
  StateBase as S,
  getUserId as a,
  assertAxiosRes as b,
  enableFilter as c,
  disableResolveIp as d,
  enableResolveIp as e,
  disableFilter as f,
  getRemoteFile as g,
  enableHost as h,
  disableHost as i,
  enableRule as j,
  disableRule as k,
  getUserInfo as l,
  saveFile as s
};
//# sourceMappingURL=StateBase.js.map
