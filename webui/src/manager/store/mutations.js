import forEach from 'lodash/forEach';

//
export function setUserId(state, userId) {
  state.userId = userId;
}

export function setConfigure(state, configure) {
  state.configure = configure;
}

export function setAppInfo(state, appInfo) {
  state.appInfo = appInfo;
}

export function setProfile(state, profile) {
  state.profile = profile;
  let result = [];
  forEach(profile.redirectPathVariables, (value, key) => {
    result.push({
      key,
      value
    });
  });
  state.redirectPathVariableArray = result;
}

export function setBindedDeviceList(state, bindedDeviceList) {
  state.bindedDeviceList = bindedDeviceList;
}

export function setHostFileList(state, hostFileList) {
  state.hostFileList = hostFileList;
}

export function setRuleFileList(state, ruleFileList) {
  state.ruleFileList = ruleFileList;
}

export function setFilters(state, filters) {
  state.filters = filters;
}

export function setDataList(state, dataList) {
  state.dataList = dataList;
}
