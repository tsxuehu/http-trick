// 数据中心

export default {
  userInfo: {
    userId: 'guest', deviceId: '', clientIp: ''
  },
  appInfo: {},
  bindedDeviceList: [],
  // host文件列表
  hostFileList: [],

  // 监控数据
  // 记录id 和 row中索引的映射关系
  recordMap: {}, // 当前所有记录
  originRecordArray: [],// 原始记录数组 存放记录id
  filteredRecordArray: [], // 过滤后的数组 存放记录id
  monitorState: {
    stopRecord: false, // 停止记录
    overflow: false // 打到最大记录数显示
  },

  // 交互数据
  selectRecordId: '',//当前选择的记录
  rightClickedRecordId: '',// 右击的记录id
  rightClickedDeviceId: '',// 右击的设备id
  currentRequestBody: '',// 选择记录的请求body
  currentResponseBody: '',// 选择记录的响应body

  filter: { // 过滤器
    host: '',
    path: ''
  }
}
