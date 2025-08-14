import { G as Layout, r as reactExports, H as theme, j as jsxRuntimeExports, K as axios, g as getServiceSync, p as produce, T as ServiceRegistry, U as setServiceRegistry, k as clientExports } from "./vendor.js";
import { b as assertAxiosRes, l as getUserInfo, S as StateBase } from "./StateBase.js";
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { style: { height: "100vh" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { style: { padding: 0, background: colorBgContainer } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG
        },
        children: "Bill is a cat."
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { style: { textAlign: "center" }, children: [
      "Http Trick ©",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Created by tsxuehu"
    ] })
  ] }) });
};
var EService = /* @__PURE__ */ ((EService2) => {
  EService2["IWorkbenchService"] = "WorkbenchService";
  EService2["ITrafficService"] = "TrafficService";
  return EService2;
})(EService || {});
async function getAppInfo() {
  const response = await axios.get("/app/get-info");
  assertAxiosRes(response);
  return response.data.data;
}
const trafficService = getServiceSync(EService.ITrafficService);
class WorkbenchService {
  async start(query) {
    this.initSocketIO();
    const userInfo = await getUserInfo();
    const appInfo = await getAppInfo();
    trafficService.setUserInfo(userInfo);
    trafficService.setAppInfo(appInfo);
  }
  initSocketIO() {
    const io = window.io;
    if (!io) {
      console.error("没有websock环境");
      return;
    }
    let socket = io("/httptrafic");
    socket.on("rows", (rows) => {
      trafficService.setTraffic(rows);
    });
    socket.on("filter", (filter) => {
      trafficService.setLocalFilter(filter);
    });
    socket.on("state", (state) => {
      trafficService.setMonitorState(state);
    });
    socket.on("clear", () => {
      trafficService.clearLocalMonitorData();
    });
    socket.on("bindedDeviceList", (deviceList) => {
      trafficService.setBindedDeviceList(deviceList);
    });
    socket.on("hostfilelist", (data) => {
      trafficService.setHostFileList(data);
    });
  }
}
async function getResponseBody(id) {
  try {
    let result = await axios.get(`/traffic/getResponseBody?id=${id}`);
    return result.data;
  } catch (e) {
    return "";
  }
}
async function getRequestBody(id) {
  try {
    let result = await axios.get(`/traffic/getRequestBody?id=${id}`);
    return result.data;
  } catch (e) {
    return "";
  }
}
async function setStopRecord(stop) {
  let response = await axios.get(`/traffic/stopRecord?stop=${stop}`);
  assertAxiosRes(response);
}
async function clear() {
  let response = await axios.get("/traffic/clear");
  assertAxiosRes(response);
}
async function setFilter(filter) {
  let response = await axios.get(`/traffic/setfilter?path=${filter.path}&host=${filter.host}`);
  assertAxiosRes(response);
}
class TrafficService extends StateBase {
  constructor() {
    super({
      userInfo: {
        userId: "guest",
        deviceId: "",
        clientIp: ""
      },
      requestingClear: false,
      appInfo: {},
      bindedDeviceList: [],
      // host文件列表
      hostFileList: [],
      // 监控数据
      // 记录id 和 row中索引的映射关系
      recordMap: {},
      // 当前所有记录
      originRecordArray: [],
      // 原始记录数组 存放记录id
      filteredRecordArray: [],
      // 过滤后的数组 存放记录id
      monitorState: {
        stopRecord: false,
        // 停止记录
        overflow: false
        // 打到最大记录数显示
      },
      // 交互数据
      selectRecordId: "",
      //当前选择的记录
      rightClickedRecordId: "",
      // 右击的记录id
      rightClickedDeviceId: "",
      // 右击的设备id
      currentRequestBody: "",
      // 选择记录的请求body
      currentResponseBody: "",
      // 选择记录的响应body
      filter: {
        // 过滤器
        host: "",
        path: ""
      }
    });
  }
  setUserInfo(userInfo) {
    this.setState({
      userInfo
    });
  }
  setAppInfo(appInfo) {
    this.setState({ appInfo });
  }
  setTraffic(trafficRecords) {
    const state = this.getState();
    const { monitorState, filter, requestingClear } = state;
    if (monitorState.stopRecord || requestingClear) {
      return;
    }
    let { host: hostFilter, path: pathFilter } = filter;
    const newState = produce(state, (draft) => {
      const { recordMap, originRecordArray, filteredRecordArray } = draft;
      for (let row of trafficRecords) {
        let id = row.id;
        let hasRecieved = !!recordMap[id];
        let record = recordMap[id] || {};
        Object.assign(record, row);
        recordMap[id] = record;
        if (!hasRecieved) {
          originRecordArray.push(id);
        }
        let originRequest = row.originRequest;
        if (originRequest && originRequest.hostname.indexOf(hostFilter) > -1 && originRequest.path.indexOf(pathFilter) > -1) {
          filteredRecordArray.push(id);
        }
      }
    });
    this.setState(newState);
  }
  setLocalFilter(filter) {
    const state = this.getState();
    const { originRecordArray, filter: origin, recordMap } = state;
    if (origin.path == filter.path && origin.host == filter.host) {
      return;
    }
    let filtered = [];
    let { host: hostFilter, path: pathFilter } = filter;
    for (let originId of originRecordArray) {
      const row = recordMap[originId];
      let originRequest = row.originRequest;
      if (originRequest && originRequest.hostname.indexOf(hostFilter) > -1 && originRequest.path.indexOf(pathFilter) > -1) {
        filtered.push(row.id);
      }
    }
    this.setState({
      filter,
      filteredRecordArray: filtered
    });
  }
  setMonitorState(monitorState) {
    this.setState({ monitorState });
  }
  clearLocalMonitorData() {
    this.setState({
      requestingClear: false,
      recordMap: {},
      originRecordArray: [],
      filteredRecordArray: [],
      selectRecordId: "",
      currentRequestBody: "",
      currentResponseBody: ""
    });
  }
  setBindedDeviceList(bindedDeviceList) {
    this.setState({ bindedDeviceList });
  }
  setHostFileList(hostFileList) {
    this.setState({ hostFileList });
  }
  async requestSetStopRecord(stop) {
    await setStopRecord(stop);
  }
  async requestSetFilter(filter) {
    await setFilter(filter);
  }
  async requestClearMonitorData() {
    this.setState({
      requestingClear: true
    });
    await clear();
  }
  async selectRecordById(id) {
    const { selectRecordId, recordMap } = this.getState();
    if (selectRecordId == id) {
      return;
    }
    this.setState({
      selectRecordId: id,
      currentRequestBody: "",
      currentResponseBody: ""
    });
    const currentRow = recordMap[id];
    if (/(json)|(x-www-form-urlencoded)/i.test(currentRow.originRequest.headers["content-type"])) {
      const reqBody = await getRequestBody(id);
      this.setState({
        currentRequestBody: reqBody
      });
    }
    try {
      if (/(text)|(javascript)|(json)/i.test(currentRow.response.headers["content-type"])) {
        const resBody = await getResponseBody(id);
        this.setState({
          currentResponseBody: resBody
        });
      }
    } catch (e) {
      console.log("请求body数据失败", currentRow, e);
    }
  }
}
const services = {
  [EService.IWorkbenchService]: new WorkbenchService(),
  [EService.ITrafficService]: new TrafficService()
};
const workbenchService = getServiceSync(EService.IWorkbenchService);
async function init() {
  const registry = new ServiceRegistry();
  registry.registerServiceBatch(services);
  setServiceRegistry(registry);
  clientExports.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
  await workbenchService.start({});
}
init();
//# sourceMappingURL=monitor.js.map
