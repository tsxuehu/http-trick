import * as trafficApi from 'src/api/traffic';
//

export const recordTotalCount = state => {
  return state.filteredRecordArray.length;
};

export const deviceIdNameMap = state => {
  let idNameMap = {};
  state.bindedDeviceList.forEach(device => {
    idNameMap[device.id] = device.name;
  });
  return idNameMap;
};

export const currentDeviceId = state => {
  return state.userInfo.deviceId;
};

export const currentSelectRecord = state => {
  return state.recordMap[state.selectRecordId] || {};
};

export const rightClickedRecord = state => {
  return state.recordMap[state.rightClickRecordId];
};

export const rightClickedDevice = state => {
  let device = state.bindedDeviceList.find(d => {
    return d.id == state.rightClickDeviceId;
  })
  return device || {};
};


// 当前请求的header键值对
export const requestHeader = state => {
  try {
    return state.currentRow.requestData.headers;
  } catch (e) {
    return {};
  }
};

export const requestCookie = state => {
  try {
    return trafficApi.parseCookie(state.currentRow.requestData.headers.cookie || '');
  } catch (e) {
    return {};
  }
};

export const requestQueryParams = state => {
  try {
    return trafficApi.parseQuery(state.currentRow.requestData.path);
  } catch (e) {
    return {};
  }
};

export const responseHeader = state => {
  try {
    let headers = Object.assign({}, state.currentRow.response.headers);
    delete headers['set-cookie'];
    return headers;
  } catch (e) {
    return {};
  }
};
export const setCookies = state => {
  try {
    return state.currentRow.response.headers['set-cookie'] || [];
  } catch (e) {
    return [];
  }
};

export const timeline = state => {
  return {
    '请求': ''
  }
};
