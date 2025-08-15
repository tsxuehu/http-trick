import { e as React, j as jsxRuntimeExports, V as cn, k as clientExports, g as getServiceSync, W as AutoSizer, X as FixedSizeList, Y as RefIcon, Z as RefIcon$1, _ as RefIcon$2, I as Input, B as Button, G as Layout, r as reactExports, H as theme, K as axios, p as produce, T as ServiceRegistry, U as setServiceRegistry } from "./vendor.js";
import { b as assertAxiosRes, l as getUserInfo, S as StateBase } from "./StateBase.js";
var EService = /* @__PURE__ */ ((EService2) => {
  EService2["IWorkbenchService"] = "WorkbenchService";
  EService2["ITrafficService"] = "TrafficService";
  return EService2;
})(EService || {});
class BodyClickListener {
  _isListening = false;
  _listener;
  constructor(fn) {
    this._listener = fn;
  }
  get isListening() {
    return this._isListening;
  }
  start() {
    window.addEventListener("click", this._onclick, true);
    window.addEventListener("keyup", this._onescape, true);
    this._isListening = true;
  }
  stop() {
    window.removeEventListener("click", this._onclick, true);
    window.removeEventListener("keyup", this._onescape, true);
    this._isListening = false;
  }
  _onclick = (e) => {
    e.preventDefault();
    this._listener?.(e);
  };
  _onescape = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      this._listener?.(e);
    }
  };
}
class ContextMenuWrapper extends React.PureComponent {
  divRef = React.createRef();
  bodyClickListener;
  componentDidMount() {
    this.bodyClickListener = new BodyClickListener((event) => {
      const outsideClick = !this.divRef.current?.contains(event.target);
      if (outsideClick) {
        this.props.close();
      }
    });
    this.bodyClickListener.start();
  }
  componentWillUnmount() {
    this.bodyClickListener?.stop();
  }
  render() {
    const { top, left } = this.props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: this.divRef,
        className: cn("ctx-menu-container"),
        style: {
          top: top + "px",
          left: left + "px"
        },
        onClick: (e) => e.stopPropagation(),
        onContextMenu: (e) => e.stopPropagation(),
        children: this.props.renderContextMenu(this.props.close)
      }
    );
  }
}
function showContextMenu(options) {
  const { top, left, render } = options;
  const menuContainerDiv = document.createElement("div");
  document.body.appendChild(menuContainerDiv);
  const root = clientExports.createRoot(menuContainerDiv);
  const destroy = () => {
    try {
      root.unmount();
      document.body.removeChild(menuContainerDiv);
    } catch (error) {
    }
  };
  root.render(
    React.createElement(ContextMenuWrapper, {
      top,
      left,
      renderContextMenu: render,
      close: destroy
    })
  );
}
const trafficService$2 = getServiceSync(EService.ITrafficService);
class RecordList extends React.PureComponent {
  state = {
    filteredRecordArray: [],
    rightClickedRecordId: -1,
    selectRecordId: -1
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$2.subscribe((state) => {
      this.setState({
        filteredRecordArray: state.filteredRecordArray,
        rightClickedRecordId: state.rightClickedRecordId,
        selectRecordId: state.selectRecordId
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  onContextMenu(event) {
    event.preventDefault();
    showContextMenu({
      top: 100,
      left: 100,
      render: (close) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "上下文菜单测试" });
      }
    });
  }
  onClickRow() {
  }
  renderRow(index, rowId, style) {
    const { selectRecordId, rightClickedRecordId } = this.state;
    const recordMap = trafficService$2.getRecordMap();
    const { response, requestData, originRequest } = recordMap[rowId];
    let duration;
    if (response) {
      duration = response?.remoteResponseEndTime - response?.remoteRequestBeginTime;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style,
        onClick: () => this.onClickRow(),
        className: cn("record row", {
          selected: selectRecordId === rowId,
          "right-clicked": rightClickedRecordId === rowId
        }),
        onContextMenu: (e) => this.onContextMenu(e),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-index", children: index + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-status", children: response?.statusCode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-method", children: originRequest?.method }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-protocol", children: originRequest?.protocol }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-host", children: originRequest?.hostname }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-path", children: originRequest?.pathname }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-type", children: originRequest?.headers["content-type"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-device", children: originRequest?.deviceId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-time", children: duration })
        ]
      }
    );
  }
  render() {
    const { filteredRecordArray } = this.state;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "traffic-list", onContextMenu: (e) => this.onContextMenu(e), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-index", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-status", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-method", children: "Method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-protocol", children: "Protocol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-host", children: "Host" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-path", children: "Path" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-type", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-device", children: "Device" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell cell-time", children: "Time" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AutoSizer, { disableWidth: true, children: ({ height }) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FixedSizeList,
          {
            height,
            width: 300,
            itemCount: filteredRecordArray.length,
            itemSize: 35,
            itemData: {
              dataSource: filteredRecordArray
            },
            itemKey: (index, data) => {
              return data.dataSource[index];
            },
            children: ({ index, style, data }) => this.renderRow(index, data.dataSource[index], style)
          }
        );
      } })
    ] });
  }
}
const trafficService$1 = getServiceSync(EService.ITrafficService);
class TopBar extends React.PureComponent {
  state = {
    monitorState: trafficService$1.getMonitorState(),
    filter: trafficService$1.getLocalFilter()
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$1.subscribe((state) => {
      this.setState({ monitorState: state.monitorState, filter: state.filter });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  clearMonitorData() {
  }
  setRecordState(record) {
  }
  setHost(host) {
  }
  setPath(path) {
  }
  render() {
    const { monitorState, filter } = this.state;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "top-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `icon-btn ${monitorState.overflow ? "overflow" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { onClick: () => this.setRecordState(false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { onClick: () => this.setRecordState(true) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-btn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { onClick: () => this.clearMonitorData() }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tips ", style: { visibility: monitorState.overflow ? "initial" : "hidden" }, children: "记录已满，请清除历史记录" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "filters", children: [
        "Filter:",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Host", value: filter.host, onChange: (e) => this.setHost(e.target.value) }),
        "/",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Path", value: filter.path, onChange: (e) => this.setPath(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placeholder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "goto-manager", href: "/index.html", target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "管理" }) })
    ] });
  }
}
class RecordDetail extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "traffic-detail", children: "RecordDetail" });
  }
}
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { style: { height: "100vh" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { style: { padding: 0, background: colorBgContainer }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "monitor-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RecordList, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RecordDetail, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { style: { textAlign: "center" }, children: [
      "Http Trick ©",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Created by tsxuehu"
    ] })
  ] }) });
};
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
      selectRecordId: -1,
      //当前选择的记录
      rightClickedRecordId: -1,
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
  getLocalFilter() {
    return this.getState().filter;
  }
  setMonitorState(monitorState) {
    this.setState({ monitorState });
  }
  getMonitorState() {
    return this.getState().monitorState;
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
  getRecordMap() {
    return this.getState().recordMap;
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
