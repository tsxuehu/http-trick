import { u as useLocation, j as jsxRuntimeExports, M as Menu, L as Link, R as RefIcon, a as RefIcon$1, b as RefIcon$2, c as RefIcon$3, d as RefIcon$4, g as getServiceSync, e as React, q as qrcode, s as staticMethods, I as Input, P as Popconfirm, B as Button, F as ForwardTable, f as Routes, h as Route, N as Navigate, i as Layout, r as reactExports, t as theme, H as HashRouter, k as axios, l as createStore, S as ServiceRegistry, m as setServiceRegistry, n as clientExports } from "./vendor.js";
const items = [
  {
    key: "/helpinstall",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/helpinstall", children: "使用说明" })
  },
  {
    key: "/proxy-configure",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/proxy-configure", children: "代理配置" })
  },
  {
    key: "/redirect-path-variable",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/redirect-path-variable", children: "转发路径变量" })
  },
  {
    key: "/hostfilelist",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hostfilelist", children: "Host 管理" })
  },
  {
    key: "/filter",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/filter", children: "Http 过滤器" })
  },
  {
    key: "/rulefilelist",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rulefilelist", children: "Http 转发" })
  },
  {
    key: "/datalist",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/datalist", children: "自定义 mock 数据" })
  },
  {
    key: "/device",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
    label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/device", children: "设备管理" })
  }
];
function HttpTrickMenu() {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { theme: "dark", selectedKeys: [location.pathname], mode: "inline", items });
}
var EService = /* @__PURE__ */ ((EService2) => {
  EService2["IWorkbenchService"] = "WorkbenchService";
  EService2["IUserService"] = "UserService";
  EService2["IAppInfoService"] = "AppInfoService";
  EService2["IConfigureService"] = "ConfigureService";
  EService2["IMockDataService"] = "DataService";
  EService2["IDeviceService"] = "DeviceService";
  EService2["IFilterService"] = "FilterService";
  EService2["IHostService"] = "HostService";
  EService2["IProfileService"] = "ProfileService";
  EService2["IRuleService"] = "RuleService";
  return EService2;
})(EService || {});
const appInfoService$1 = getServiceSync(EService.IAppInfoService);
const userService$1 = getServiceSync(EService.IUserService);
class Help extends React.PureComponent {
  state = {
    appInfo: appInfoService$1.getState(),
    userInfo: userService$1.getState()
  };
  componentDidMount() {
    userService$1.subscribe((userInfo) => {
      this.setState({ userInfo });
    });
    appInfoService$1.subscribe((appInfo) => {
      this.setState({ appInfo });
    });
  }
  render() {
    const { appInfo, userInfo } = this.state;
    const certUrl = `http://${appInfo.pcIp}:${appInfo.webUiPort}/utils/rootCA.crt`;
    const imgUrl = qrcode.toDataURL(certUrl, 4);
    const remotePacUrl = `http://${appInfo.pcIp}:${appInfo.webUiPort}/profile/proxy.pac?proxy-ip=${appInfo.pcIp}&user-id=${userInfo.userId}`;
    const localPacUrl = `http://127.0.0.1:${appInfo.webUiPort}/profile/proxy.pac?proxy-ip=127.0.0.1&user-id=${userInfo.userId}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "install-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Http Trick" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "toc_0", children: "一、说明" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "http trick是http协议代理工具，需要设置浏览器代理或者系统代理才能使用本工具。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "远程PAC: ",
        remotePacUrl
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "本地PAC: ",
        localPacUrl
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "toc_1", children: "二、chrome 代理插件安装(用于设置浏览器代理)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "推荐安装 SwitchyOmega ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped",
            target: "_blank",
            children: "点击安装代理插件"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { id: "toc_2", children: "插件使用说明" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "安装完插件后请设置插件代理地址为",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "127.0.0.1" }),
          "，代理协议: http，端口为",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "http trick" }),
          "代理端口(默认8001)。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "如不清楚如何配置 SwitchyOmega，请参考 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/help/chrome/", target: "_blank", children: "chrome 代理设置指南" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "toc_3", children: "三、证书安装" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { id: "toc_4", children: "1. 为什么需要安装证书" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "由于",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "http trick" }),
        "会代理 https 的请求，所以需要本地安装",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "http trick" }),
        "的https 证书。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { id: "toc_5", children: "2. 证书下载" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "mac 系统请",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: certUrl, children: "点击下载到本地安装" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "手机请扫码安装证书",
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "install-body__qrcode", src: imgUrl })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "证书信任请参考",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/help/cert/", target: "_blank", children: "如何信任证书" })
        ] })
      ] })
    ] });
  }
}
getServiceSync(EService.IProfileService);
class ProxyConfigure extends React.PureComponent {
  state = {};
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {});
  }
}
const profileService$1 = getServiceSync(EService.IProfileService);
class RedirectPathVariable extends React.PureComponent {
  state = {
    redirectPathVariableArray: []
  };
  componentDidMount() {
    profileService$1.subscribe((userProfile) => {
      const pairs = [];
      for (const [key, value] of Object.entries(userProfile.redirectPathVariables)) {
        pairs.push({
          key,
          value
        });
      }
      this.setState({ redirectPathVariableArray: pairs });
    });
  }
  addParam() {
    const origin = this.state.redirectPathVariableArray;
    this.setState({
      redirectPathVariableArray: [...origin, {
        key: "",
        value: ""
      }]
    });
  }
  deleteParam(index) {
    const origin = this.state.redirectPathVariableArray;
    origin.splice(index, 1);
    this.setState({ redirectPathVariableArray: [...origin] });
  }
  async saveFile() {
    let redirectPathVariableMap = {};
    const origin = this.state.redirectPathVariableArray;
    for (const { key, value } of origin) {
      redirectPathVariableMap[key] = value;
    }
    try {
      await profileService$1.saveRedirectPathVariables(redirectPathVariableMap);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  setKey(index, key) {
    const origin = this.state.redirectPathVariableArray;
    origin[index].key = key;
    this.setState({ redirectPathVariableArray: [...origin] });
  }
  setValue(index, value) {
    const origin = this.state.redirectPathVariableArray;
    origin[index].value = value;
    this.setState({ redirectPathVariableArray: [...origin] });
  }
  getColumns() {
    return [
      {
        title: "变量名",
        dataIndex: "key",
        key: "key",
        render: (value, record, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => this.setKey(index, e.target.value), placeholder: "工程名" })
      },
      {
        title: "变量值",
        dataIndex: "value",
        key: "value",
        render: (value, record, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value,
            onChange: (e) => this.setValue(index, e.target.value),
            placeholder: "工程在本地的绝对路径"
          }
        )
      },
      {
        title: "操作",
        key: "action",
        render: (_, record, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Popconfirm,
          {
            title: "确认",
            description: "确认删除?",
            onConfirm: () => this.deleteParam(index),
            okText: "确认",
            cancelText: "取消",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", children: "删除" })
          }
        )
      }
    ];
  }
  render() {
    const { redirectPathVariableArray } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-wraper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "转发路径变量管理" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "project-path-info",
          children: [
            "配置http转发规则时，转发路径可以引用这里的变量。例如：将http请求转发到",
            "${helloworld}",
            "/dist/hello.js，",
            "${helloworld}",
            "会被替换为变量helloworld对应的值。"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "key", dataSource: redirectPathVariableArray, columns }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "50px", textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => this.addParam(), children: "增加工程路径设置" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.saveFile(), children: "保存" })
      ] })
    ] });
  }
}
class HostList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "HostList" });
  }
}
class EditHost extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "EditHost" });
  }
}
class CreateHost extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "CreateHost" });
  }
}
class RuleList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "RuleList" });
  }
}
class EditRule extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "EditHost" });
  }
}
class CreateRule extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "CreateHost" });
  }
}
class FilterList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "FilterList" });
  }
}
class DataList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "DataList" });
  }
}
class DeviceList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "DeviceList" });
  }
}
function ViewRouter() {
  return (
    // <Suspense>
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/helpinstall" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/helpinstall", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Help, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/proxy-configure", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProxyConfigure, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/redirect-path-variable", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RedirectPathVariable, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/hostfilelist", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/edithost", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EditHost, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/createhostfile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateHost, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/rulefilelist", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RuleList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/editrule", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EditRule, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/createrulefile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateRule, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/filter", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/datalist", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DataList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/device", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceList, {}) })
    ] })
  );
}
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HashRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { style: { minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sider, { collapsible: true, collapsed, onCollapse: (value) => setCollapsed(value), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HttpTrickMenu, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { style: { padding: 0, background: colorBgContainer } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ViewRouter, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { style: { textAlign: "center" }, children: [
        "Http Trick ©",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Created by tsxuehu"
      ] })
    ] })
  ] }) });
};
async function saveFile(content) {
  const response = await axios.post("/profile/savefile", content);
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}
function disableRule() {
  return axios.post(`/profile/setRuleState`);
}
function enableRule() {
  return axios.post(`/profile/setRuleState?rulestate=1`);
}
function disableResolveHost() {
  return axios.post(`/profile/setResolveHost`);
}
function enableResolveHost() {
  return axios.post(`/profile/setResolveHost?resolve=1`);
}
function disableHost() {
  return axios.post(`/profile/setHostState`);
}
function enableHost() {
  return axios.post(`/profile/setHostState?hoststate=1`);
}
function disableFilter() {
  return axios.post(`/profile/setFilterState`);
}
function enableFilter() {
  return axios.post(`/profile/setFilterState?filterstate=1`);
}
async function getUserId() {
  const result = await axios.get(`/profile/getUserId`);
  return result.data.data.userId;
}
const appInfoService = getServiceSync(EService.IAppInfoService);
const configureService = getServiceSync(EService.IConfigureService);
const mockDataService = getServiceSync(EService.IMockDataService);
const deviceService = getServiceSync(EService.IDeviceService);
const filterService = getServiceSync(EService.IFilterService);
const hostService = getServiceSync(EService.IHostService);
const profileService = getServiceSync(EService.IProfileService);
const ruleService = getServiceSync(EService.IRuleService);
const userService = getServiceSync(EService.IUserService);
class WorkbenchService {
  async start(query) {
    this.initSocketIO();
    const userId = await getUserId();
    userService.setState({ userId });
  }
  initSocketIO() {
    const io = window.io;
    if (!io) {
      console.error("没有websock环境");
      return;
    }
    let socket = io("/manager");
    socket.on("appinfo", (data) => {
      appInfoService.setState(data);
    });
    socket.on("configure", (data) => {
      configureService.setState(data);
    });
    socket.on("profile", (data) => {
      profileService.setState(data);
    });
    socket.on("bindedDeviceList", (data) => {
      deviceService.setState(data);
    });
    socket.on("hostfilelist", (data) => {
      hostService.setState(data);
    });
    socket.on("rulefilelist", (data) => {
      ruleService.setState(data);
    });
    socket.on("filters", (data) => {
      filterService.setState(data);
    });
    socket.on("datalist", (data) => {
      mockDataService.setState(data);
    });
  }
}
class StateBase {
  __store;
  constructor(initialState) {
    this.__store = createStore((set) => initialState);
  }
  setState(partial) {
    this.__store.setState(partial);
  }
  getState() {
    return this.__store.getState();
  }
  subscribe(listener) {
    listener(this.__store.getState());
    return this.__store.subscribe(listener);
  }
}
class AppInfoService extends StateBase {
  constructor() {
    super({
      appName: "Http-Trick",
      single: true,
      httpProxyPort: 0,
      httpsProxyPort: 0,
      socks5ProxyPort: 0,
      dnsPort: 0,
      webUiPort: 0,
      startHttpProxy: false,
      startSocks5: false,
      startDns: false,
      pcIp: ""
    });
  }
}
class ConfigureService extends StateBase {
  constructor() {
    super({
      professionalVersion: false,
      httpProxyPort: 8001,
      socks5ProxyPort: 8002,
      dnsPort: 53,
      webUiPort: 40010,
      startDns: false,
      startSocks5: true,
      startHttpProxy: true,
      requestTimeoutTime: 3e4,
      useCustomRootCA: false,
      remoteDnsServer: "223.5.5.5"
    });
  }
}
class MockDataService extends StateBase {
  constructor() {
    super([]);
  }
}
class DeviceService extends StateBase {
  constructor() {
    super([]);
  }
}
class FilterService extends StateBase {
  constructor() {
    super([]);
  }
}
async function useFile(id) {
  const response = await axios.get(`/host/usefile?id=${id}`);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}
class HostService extends StateBase {
  constructor() {
    super([]);
  }
  async selectHostFile(id) {
    await useFile(id);
  }
}
class ProfileService extends StateBase {
  constructor() {
    super({
      redirectPathVariables: {},
      enableRule: true,
      enableHost: true,
      enableFilter: true,
      goThroughProxyConfig: "",
      resolveHost: false,
      externalProxy: false,
      externalHttpProxy: false,
      externalSocks5Proxy: true,
      httpProxyIp: "",
      httpProxyPort: 8888,
      socks5ProxyIp: "",
      socks5ProxyPort: 8889
    });
  }
  async switchResolveHost() {
    const profile = this.getState();
    if (profile.resolveHost) {
      await disableResolveHost();
    } else {
      await enableResolveHost();
    }
  }
  async switchHost() {
    const profile = this.getState();
    if (profile.enableHost) {
      await disableHost();
    } else {
      await enableHost();
    }
  }
  async switchFilter() {
    const profile = this.getState();
    if (profile.enableFilter) {
      disableFilter();
    } else {
      enableFilter();
    }
  }
  async switchRule() {
    const profile = this.getState();
    if (profile.enableRule) {
      disableRule();
    } else {
      enableRule();
    }
  }
  async saveRedirectPathVariables(variables) {
    const data = this.getState();
    let copyProfile = JSON.parse(JSON.stringify(data));
    copyProfile.redirectPathVariables = variables;
    await saveFile(copyProfile);
  }
}
async function setFileCheckStatus(id, checked) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
  let serverData = response.data;
  if (serverData.code != 0) {
    throw new Error(serverData.msg);
  }
}
class RuleService extends StateBase {
  constructor() {
    super([]);
  }
  async setFileCheckStatus(ruleFileId, check) {
    await setFileCheckStatus(ruleFileId, check);
  }
}
class UserService extends StateBase {
  constructor() {
    super({
      userId: "root"
    });
  }
}
const services = {
  [EService.IWorkbenchService]: new WorkbenchService(),
  [EService.IUserService]: new UserService(),
  [EService.IAppInfoService]: new AppInfoService(),
  [EService.IConfigureService]: new ConfigureService(),
  [EService.IMockDataService]: new MockDataService(),
  [EService.IDeviceService]: new DeviceService(),
  [EService.IFilterService]: new FilterService(),
  [EService.IHostService]: new HostService(),
  [EService.IProfileService]: new ProfileService(),
  [EService.IRuleService]: new RuleService()
};
const workbenchService = getServiceSync(EService.IWorkbenchService);
async function init() {
  const registry = new ServiceRegistry();
  registry.registerServiceBatch(services);
  setServiceRegistry(registry);
  clientExports.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
  document.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.code == "KeyS") {
      event.preventDefault();
      return false;
    }
  }, true);
  await workbenchService.start({});
}
init();
//# sourceMappingURL=manager.js.map
