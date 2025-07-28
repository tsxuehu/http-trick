import * as trafficApi from 'src/api/traffic';
import profileApi from 'src/api/profile';
import appApi from 'src/api/app';

/**
 *
 */
export async function initStore({commit, dispatch}) {
  let result = await profileApi.getUserInfo();
  commit('setUserInfo', result.data.data);

  let appInfo = await appApi.getAppInfo();
  commit('setAppInfo', appInfo.data.data);

  if (!window.io) return;
  let socket = io('/httptrafic');

  socket.on('rows', rows => {
    commit('setTraffic', rows);
  });

  socket.on('filter', filter => {
    commit('setLocalFilter', filter);
  });

  socket.on('state', state => {
    commit('setMonitorState', state);
  });

  socket.on('clear', () => {
    commit('clearLocalMonitorData');
  });

  socket.on('bindedDeviceList', deviceList => {
    commit('setBindedDeviceList', deviceList);
  });

  socket.on('hostfilelist', data => {
    commit('setHostFileList', data);
  });

}

export async function toggleRecordState({state, commit, dispatch}) {
  let monitorState = state.monitorState;

  monitorState.stopRecord = !monitorState.stopRecord;
  commit('setMonitorState', monitorState);
  // 向远端发送请求
  trafficApi.setStopRecord(monitorState.stopRecord);
}

export async function setFilter({state, commit, dispatch}, filter) {

  commit('setLocalFilter', filter);
  // 向远端发送请求
  trafficApi.setFilter(state.filter);
}

export async function selectRecordById({state, commit, dispatch}, id) {
  if (state.selectRecordId == id) return;
  state.selectRecordId = id;
  state.currentRequestBody = '';
  state.currentResponseBody = '';
  let currentRow = state.recordMap[id];
  if (/(json)|(x-www-form-urlencoded)/i.test(currentRow.originRequest.headers['content-type'])) {
    // 请求后端 拿数据
    state.currentRequestBody = await trafficApi.getRequestBody(id);
  }
  // 如果是html json数据 向后端请求拿数据
  try {
    if (/(text)|(javascript)|(json)/i.test(currentRow.response.headers['content-type'])) {
      // 请求后端 拿数据
      state.currentResponseBody = await trafficApi.getResponseBody(id);
    }
  } catch (e) {
    console.log('请求body数据失败', currentRow, e);
  }
}

export async function clearMonitorData({state, commit, dispatch}) {
  commit('clearLocalMonitorData');
  trafficApi.clear();
}
