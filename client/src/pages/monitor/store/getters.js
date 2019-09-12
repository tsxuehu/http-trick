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
