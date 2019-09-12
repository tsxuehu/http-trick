import profileApi from 'src/api/profile';
import * as hostApi from 'src/api/host';
import * as ruleApi from 'src/api/rule';

/**
 *
 */
export async function initStore({commit, dispatch}) {
  // 获取用户id
  let result = await profileApi.getUserId();
  let userId = result.data.data.userId;
  commit('setUserId', userId);
  if (!window.io) {
    console.error('没有websock环境');
    return;
  }
  let socket = io('/manager');

  socket.on('configure', data => {
    commit('setConfigure', data);
  });

  socket.on('appinfo', data => {
    commit('setAppInfo', data);
  });

  socket.on('profile', data => {
    commit('setProfile', data);
  });

  socket.on('bindedDeviceList', data => {
    commit('setBindedDeviceList', data);
  });

  socket.on('hostfilelist', data => {
    commit('setHostFileList', data);
  });

  socket.on('rulefilelist', data => {
    commit('setRuleFileList', data);
  });

  socket.on('filters', data => {
    commit('setFilters', data);
  });

  socket.on('datalist', data => {
    commit('setDataList', data);
  });
}


export async function selectHostFile({commit, dispatch}, id) {
  let response = await hostApi.useFile(id);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}

export async function switchHost({state}) {
  if (state.profile.enableHost) {
    await profileApi.disableHost();
  } else {
    await profileApi.enableHost();
  }
}

export async function switchFilter({state}) {
  if (state.profile.enableFilter) {
    profileApi.disableFilter();
  } else {
    profileApi.enableFilter();
  }
}


export async function switchRule({state}) {
  if (state.profile.enableRule) {
    profileApi.disableRule();
  } else {
    profileApi.enableRule();
  }
}

export async function setFileCheckStatus({state}, {ruleFileId, check}) {
  let response = await ruleApi.setFileCheckStatus(ruleFileId, check);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}
