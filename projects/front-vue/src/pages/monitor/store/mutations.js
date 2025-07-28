import forEach from 'lodash/forEach';
import Vue from 'vue';
//
export function setUserInfo(state, userInfo) {
  state.userInfo = userInfo;
}

export function setAppInfo(state, appInfo) {
  state.appInfo = appInfo;
}

export function setBindedDeviceList(state, bindedDeviceList) {
  state.bindedDeviceList = bindedDeviceList;
}

export function setHostFileList(state, hostFileList) {
  state.hostFileList = hostFileList;
}

export function setRightClickedRecordId(state, id) {
  state.rightClickedRecordId = id;
}

export function setRightClickedDeviceId(state, deviceId) {
  state.rightClickedDeviceId = deviceId;
}

export function setTraffic(state, trafficRecords) {
  let {monitorState} = state;
  if (monitorState.stopRecord || state.requestingClear) return;

  let {host: hostFilter, path: pathFilter} = state.filter;
  forEach(trafficRecords, (row) => {
    let id = row.id;
    let hasRecieved = !!state.recordMap[id];
    let record = state.recordMap[id] || {};
    Object.assign(record, row);

    Vue.set(state.recordMap, id, record);

    if (!hasRecieved) {
      state.originRecordArray.push(id);
    }
    // 根据host、path进行过滤
    let originRequest = row.originRequest;
    if (originRequest
      && originRequest.host.indexOf(hostFilter) > -1
      && originRequest.path.indexOf(pathFilter) > -1) {
      state.filteredRecordArray.push(id);
    }
  });
}

export function setLocalFilter(state, filter) {
  let origin = state.filter;
  if (origin.path == filter.path && origin.host == filter.host) {
    return;
  }
  state.filter = filter;

  // 过滤数据
  let filtered = [];
  let {host: hostFilter, path: pathFilter} = state.filter;
  state.originRecordArray.forEach(id => {
    let r = state.recordMap[id];
    let originRequest = r.originRequest;
    if (originRequest
      && originRequest.host.indexOf(hostFilter) > -1
      && originRequest.path.indexOf(pathFilter) > -1) {
      filtered.push(r.id);
    }
  });
  state.filteredRecordArray = filtered;
}

export function setMonitorState(state, monitorState) {
  state.monitorState = monitorState;
}

export function clearLocalMonitorData(state) {
  state.recordMap = {};
  state.originRecordArray = [];
  state.filteredRecordArray = [];

  state.selectRecordId = '';
  state.currentRequestBody = '';
  state.currentResponseBody = '';
}

