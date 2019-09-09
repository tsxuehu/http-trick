/**
 *
 */
export async function initStore({commit, dispatch}) {
  // 获取用户id
  let result = await profileApi.getUserId();
  this.userId = result.data.data.userId;

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
