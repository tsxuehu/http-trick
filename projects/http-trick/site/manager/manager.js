import { g as getServiceSync, r as reactExports, u as useLocation, j as jsxRuntimeExports, M as Menu, L as Link, R as RefIcon, a as RefIcon$1, b as RefIcon$2, c as RefIcon$3, d as RefIcon$4, e as React, q as qrcode, s as staticMethods, F as Form, C as Checkbox, I as Input, B as Button, f as Radio, P as Popconfirm, h as ForwardTable, i as Future, k as clientExports, l as Modal, m as axios, n as copyToClipboard, N as NavLink, p as produce, o as Row, t as Col, v as useNavigate, w as find, S as Select, x as set, y as editor, z as v4, A as Routes, D as Route, E as Navigate, G as Switch, H as Layout, J as theme, K as HashRouter, O as createStore, Q as trim, T as keys, U as ServiceRegistry, V as setServiceRegistry } from "./vendor.js";
var EService = /* @__PURE__ */ ((EService2) => {
  EService2["IWorkbenchService"] = "WorkbenchService";
  EService2["IUserService"] = "UserService";
  EService2["IAppInfoService"] = "AppInfoService";
  EService2["IConfigureService"] = "ConfigureService";
  EService2["IDataFileService"] = "DataService";
  EService2["IDeviceService"] = "DeviceService";
  EService2["IFilterService"] = "FilterService";
  EService2["IHostService"] = "HostService";
  EService2["IProfileService"] = "ProfileService";
  EService2["IRuleService"] = "RuleService";
  return EService2;
})(EService || {});
const configureService$2 = getServiceSync(EService.IConfigureService);
const userService$3 = getServiceSync(EService.IUserService);
function getMenuItems() {
  const professionalVersion = configureService$2.getConfig().professionalVersion;
  const items = [
    {
      key: "/helpinstall",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
      label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/helpinstall", children: "使用说明" })
    }
  ];
  if (userService$3.isRoot()) {
    items.push({
      key: "/proxy-configure",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
      label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/proxy-app-configure", children: "代理程序设置" })
    });
  }
  if (professionalVersion) {
    items.push(
      ...[
        {
          key: "/interception-config",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interception-config", children: "请求拦截设置" })
        },
        {
          key: "/redirect-path-variable",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/redirect-path-variable", children: "转发路径变量" })
        },
        {
          key: "/hostfilelist",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hostfilelist", children: "Host 管理" })
        },
        {
          key: "/filter",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/filter", children: "Http 过滤器" })
        },
        {
          key: "/rulefilelist",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rulefilelist", children: "Http 转发" })
        },
        {
          key: "/datalist",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/datalist", children: "自定义 mock 数据" })
        },
        {
          key: "/device",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/device", children: "设备管理" })
        }
      ]
    );
  } else {
    items.push(
      ...[
        {
          key: "/interception-config",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interception-config", children: "请求拦截设置" })
        },
        {
          key: "/rulefilelist",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rulefilelist", children: "Http 转发" })
        },
        {
          key: "/datalist",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          label: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/datalist", children: "自定义 mock 数据" })
        }
      ]
    );
  }
  return items;
}
function HttpTrickMenu() {
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const unConfig = configureService$2.subscribe((config) => {
      const items2 = getMenuItems();
      setItems(items2);
    });
    const unUser = userService$3.subscribe((user) => {
      const items2 = getMenuItems();
      setItems(items2);
    });
    return () => {
      unConfig();
      unUser();
    };
  }, []);
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { theme: "dark", selectedKeys: [location.pathname], mode: "inline", items });
}
const appInfoService$3 = getServiceSync(EService.IAppInfoService);
const userService$2 = getServiceSync(EService.IUserService);
class Help extends React.PureComponent {
  state = {
    appInfo: appInfoService$3.getState(),
    userInfo: userService$2.getState()
  };
  componentDidMount() {
    userService$2.subscribe((userInfo) => {
      this.setState({ userInfo });
    });
    appInfoService$3.subscribe((appInfo) => {
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
const configureService$1 = getServiceSync(EService.IConfigureService);
const onFinishFailed$1 = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function getFormDataFromProfile$1(config) {
  return {
    startHttpProxy: config.startHttpProxy,
    startSocks5: config.startSocks5,
    startDns: config.startDns,
    professionalVersion: config.professionalVersion,
    httpProxyPort: config.httpProxyPort,
    socks5ProxyPort: config.socks5ProxyPort,
    webUiPort: config.webUiPort,
    dnsPort: config.dnsPort,
    requestTimeoutTime: config.requestTimeoutTime
  };
}
class ProxyConfigure extends React.PureComponent {
  formRef = React.createRef();
  formInitialValue = getFormDataFromProfile$1(configureService$1.getConfig());
  unConfig;
  componentDidMount() {
    this.unConfig = configureService$1.subscribe(() => {
      const newFormValue = getFormDataFromProfile$1(configureService$1.getConfig());
      this.formRef.current?.setFieldsValue(newFormValue);
    });
  }
  componentWillUnmount() {
    this.unConfig?.();
  }
  onSave = async (values) => {
    try {
      await configureService$1.save({
        startHttpProxy: values.startHttpProxy,
        startSocks5: values.startSocks5,
        startDns: values.startDns,
        professionalVersion: values.professionalVersion,
        httpProxyPort: +values.httpProxyPort,
        socks5ProxyPort: +values.socks5ProxyPort,
        webUiPort: +values.webUiPort,
        dnsPort: +values.dnsPort,
        requestTimeoutTime: +values.requestTimeoutTime
      });
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  };
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        name: "configure",
        ref: this.formRef,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        initialValues: this.formInitialValue,
        onFinish: this.onSave,
        onFinishFailed: onFinishFailed$1,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "是否开启Http代理", name: "startHttpProxy", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "是否开启Socks5代理", name: "startSocks5", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "是否开启DNS服务", name: "startDns", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "是否开启专业版", name: "professionalVersion", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "Http代理端口",
              name: "httpProxyPort",
              rules: [{ required: true, message: "填写http代理端口号" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "http代理端口" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "Socks5端口",
              name: "socks5ProxyPort",
              rules: [{ required: true, message: "填写socks5代理端口" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "socks5代理端口" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "WebUi端口", name: "webUiPort", rules: [{ required: true, message: "填写WebUi端口" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "WebUi端口" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "DNS端口", name: "dnsPort", rules: [{ required: true, message: "填写DNS端口" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "DNS端口" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "超时时间",
              name: "requestTimeoutTime",
              rules: [{ required: true, message: "填写超时时间" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "超时时间" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "保存" }) })
        ]
      }
    );
  }
}
const profileService$6 = getServiceSync(EService.IProfileService);
const PlaceHolder$1 = `#示例
all               # 有all 配置项，所有域名君走http解析代理
*.domain.com      # 所有domain域名都会走Http解析代理
www.domain.com    # www.domain.com走Http解析代理`;
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function getFormDataFromProfile(profile) {
  return {
    externalProxy: profile.externalProxy,
    isSocks5Proxy: profile.externalSocks5Proxy,
    httpProxyIp: profile.httpProxyIp,
    httpProxyPort: profile.httpProxyPort,
    socks5ProxyIp: profile.socks5ProxyIp,
    socks5ProxyPort: profile.socks5ProxyPort,
    goThroughProxyConfig: profile.goThroughProxyConfig
  };
}
class InterceptionConfig extends React.PureComponent {
  formRef = React.createRef();
  formInitialValue = getFormDataFromProfile(profileService$6.getProfile());
  unProfile;
  componentDidMount() {
    this.unProfile = profileService$6.subscribe(() => {
      const newFormValue = getFormDataFromProfile(profileService$6.getProfile());
      this.formRef.current?.setFieldsValue(newFormValue);
    });
  }
  componentWillUnmount() {
    this.unProfile?.();
  }
  onSave = async (values) => {
    try {
      await profileService$6.saveProfile({
        externalProxy: values.externalProxy,
        externalHttpProxy: !values.isSocks5Proxy,
        externalSocks5Proxy: values.isSocks5Proxy,
        httpProxyIp: values.httpProxyIp,
        httpProxyPort: values.httpProxyPort,
        socks5ProxyIp: values.socks5ProxyIp,
        socks5ProxyPort: values.socks5ProxyPort,
        goThroughProxyConfig: values.goThroughProxyConfig
      });
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  };
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        name: "configure",
        ref: this.formRef,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        initialValues: this.formInitialValue,
        onFinish: this.onSave,
        onFinishFailed,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "使用外部代理", name: "externalProxy", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { children: "使用" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                if (!externalProxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "外部代理类型", name: "isSocks5Proxy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Radio.Group,
                  {
                    options: [
                      { value: true, label: "Socks5代理" },
                      { value: false, label: "Http代理" }
                    ]
                  }
                ) });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy || prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                let isSocks5Proxy = form.getFieldValue("isSocks5Proxy");
                if (!externalProxy || isSocks5Proxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Http代理 IP", name: "httpProxyIp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Http代理 IP" }) });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy || prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                let isSocks5Proxy = form.getFieldValue("isSocks5Proxy");
                if (!externalProxy || isSocks5Proxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Http代理 Port", name: "httpProxyPort", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Http代理 Port" }) });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy || prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                let isSocks5Proxy = form.getFieldValue("isSocks5Proxy");
                if (!externalProxy || !isSocks5Proxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Socks代理 IP", name: "socks5ProxyIp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Socks代理 IP" }) });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy || prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                let isSocks5Proxy = form.getFieldValue("isSocks5Proxy");
                if (!externalProxy || !isSocks5Proxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Socks代理 Port", name: "socks5ProxyPort", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Socks代理 Port" }) });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "需要Http解析代理的域名", name: "goThroughProxyConfig", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: PlaceHolder$1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "保存" }) })
        ]
      }
    );
  }
}
const profileService$5 = getServiceSync(EService.IProfileService);
class RedirectPathVariable extends React.PureComponent {
  state = {
    redirectPathVariableArray: []
  };
  componentDidMount() {
    profileService$5.subscribe((userProfile) => {
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
      await profileService$5.saveRedirectPathVariables(redirectPathVariableMap);
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
function openDialog(dialog, props) {
  const future = new Future();
  const dialogContainerDiv = document.createElement("div");
  document.body.appendChild(dialogContainerDiv);
  const root = clientExports.createRoot(dialogContainerDiv);
  const destroy = () => {
    try {
      root.unmount();
      document.body.removeChild(dialogContainerDiv);
    } catch (error) {
    }
  };
  const dialogProps = {
    ...props,
    onOk: (data) => {
      destroy();
      future.resolve(data);
    },
    onCancel: (data) => {
      destroy();
      future.resolve(data);
    },
    onError: (error) => {
      destroy();
      future.reject(error);
    }
  };
  root.render(
    React.createElement(dialog, dialogProps)
  );
  return future.get();
}
const PromptForm = (props) => {
  const { title = "编辑信息", okText = "确认", cancelText = "取消", fields, onOk, onCancel } = props;
  const [form] = Form.useForm();
  reactExports.useEffect(() => {
    if (fields.length > 0) {
      const initialValues = {};
      fields.forEach((field) => {
        initialValues[field.key] = field.value;
      });
      form.setFieldsValue(initialValues);
    }
  }, []);
  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      title,
      okText,
      cancelText,
      open: true,
      onOk: () => handleOk(),
      onCancel: () => onCancel(void 0),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { form, layout: "vertical", name: "custom_prompt_form", children: fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form.Item,
        {
          name: field.key,
          label: field.label || field.key,
          rules: [{ required: true, message: `请输入${field.label || field.key}` }],
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: field.placeholder || `请输入${field.label || field.key}` })
        },
        field.key
      )) })
    }
  );
};
async function getRemoteFile(url) {
  const response = await axios.get(`/utils/getRemoteFile?url=${encodeURIComponent(url)}`);
  assertAxiosRes(response);
  return response.data.data;
}
function assertAxiosRes(response) {
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}
const hostService$4 = getServiceSync(EService.IHostService);
const profileService$4 = getServiceSync(EService.IProfileService);
const appInfoService$2 = getServiceSync(EService.IAppInfoService);
class HostList extends React.PureComponent {
  state = {
    hostFileList: [],
    enableHost: true
  };
  unHost;
  unProfile;
  componentDidMount() {
    this.unHost = hostService$4.subscribe((data) => {
      this.setState({ hostFileList: data.hostFileList });
    });
    this.unProfile = profileService$4.subscribe(() => {
      this.setState({ enableHost: profileService$4.getProfile().enableHost });
    });
  }
  componentWillUnmount() {
    this.unHost?.();
    this.unProfile?.();
  }
  async importRemoteHostFile() {
    const values = await openDialog(PromptForm, {
      title: "导入远程Host",
      fields: [
        { label: "请输入远程Host文件的url", key: "url", value: "", placeholder: "" },
        { label: "请输入导入Host的文件名", key: "name", value: "", placeholder: "" }
      ]
    });
    if (!values) {
      return;
    }
    const content = await getRemoteFile(values.url);
    content.meta = {
      remote: true,
      url: values.url
    };
    content.id = "";
    content.name = values.name;
    content.checked = false;
    await hostService$4.saveFile("", content);
    staticMethods.success("导入成功!");
  }
  async onDeleteFile(file, index) {
    await hostService$4.deleteFile(file.id);
    staticMethods.success("删除成功!");
  }
  onShareFile(file, index) {
    const appInfo = appInfoService$2.getAppInfo();
    let url = `http://${appInfo.pcIp}:${appInfo.webUiPort}/host/file/raw?id=${encodeURIComponent(file.id)}`;
    copyToClipboard(url);
    staticMethods.success(`已复制Host${file.name}链接`);
  }
  async useFile(file, index) {
    await hostService$4.useFile(file.id);
  }
  getColumns() {
    const { enableHost: enableHost2 } = this.state;
    return [
      {
        title: "名字",
        dataIndex: "name",
        key: "name",
        render: (value, hostFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: value })
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        render: (value, hostFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: value })
      },
      {
        title: "操作",
        key: "action",
        render: (_, hostFile, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.onDeleteFile(hostFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, children: "删除" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.onShareFile(hostFile, index), children: "分享" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: `/edithost?id=${hostFile.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", children: "编辑" }) })
          ] });
        }
      },
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, hostFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { checked: value, disabled: !enableHost2, onChange: (e) => this.useFile(hostFile, index) })
      }
    ];
  }
  render() {
    const { hostFileList } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "host-view", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "Host 文件列表" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "只允许一个host文件生效。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "host-list-op", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => this.importRemoteHostFile(), children: "导入远程Host" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/createhostfile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", children: "新增 Host 文件" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: hostFileList, columns })
    ] });
  }
}
function getQueryParams() {
  let searchString;
  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    searchString = hash.split("?")[1] || "";
  } else {
    searchString = window.location.search.slice(1);
  }
  return Object.fromEntries(new URLSearchParams(searchString));
}
const PlaceHolder = `#示例
8.8.8.8    www.google.com
4.4.4.4    *.taobao.com #所有后缀为.taobao.com的域名都被解析为4.4.4.4
6.6.6.6    www.youzan.com h5.youzan.com`;
const hostService$3 = getServiceSync(EService.IHostService);
class EditHost extends React.PureComponent {
  state = {
    hostFileId: "",
    loaded: false
  };
  async componentDidMount() {
    this.loadHostFile();
  }
  componentWillUnmount() {
  }
  async loadHostFile() {
    const query = getQueryParams();
    const id = query.id;
    const content = await hostService$3.getFileContent(id);
    if (!content) {
      return;
    }
    this.setState({
      hostFileId: id,
      loaded: true,
      hostFile: content
    });
  }
  async saveFile() {
    const { hostFile, hostFileId } = this.state;
    await hostService$3.saveFile(hostFileId, hostFile);
  }
  onContentChange(content) {
    const { hostFile } = this.state;
    const newHostFile = produce(hostFile, (draft) => {
      draft.content = content;
    });
    this.setState({
      hostFile: newHostFile
    });
  }
  render() {
    const { hostFile, loaded } = this.state;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "main-content__title", children: [
        "编辑Host文件",
        loaded ? ": " + hostFile?.name : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.saveFile(), children: "保存文件" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input.TextArea,
        {
          value: hostFile?.content,
          autoSize: { minRows: 20, maxRows: 20 },
          onChange: (e) => this.onContentChange(e.target.value),
          placeholder: PlaceHolder
        }
      )
    ] });
  }
}
const hostService$2 = getServiceSync(EService.IHostService);
const CreateHost = () => {
  const navigate = useNavigate();
  const onSave = async (values) => {
    try {
      const id = await hostService$2.createFile(values.name, values.description);
      navigate(`/edithost?id=${id}`);
      staticMethods.success("创建成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "创建Host文件" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        name: "创建规则集",
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        onFinish: onSave,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "文件名字",
              name: "name",
              rules: [
                { type: "string", required: true, message: "请输入文件名称名称" },
                { type: "string", min: 2, max: 20, message: "长度在 2 到 20 个字符" }
              ],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "文件名字" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "文件描述", name: "description", rules: [{ required: true, message: "请输文件" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: "文件描述" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Form.Item, { label: null, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => navigate(-1), children: "返回" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "创建" })
          ] })
        ]
      }
    )
  ] });
};
const ruleService$5 = getServiceSync(EService.IRuleService);
const appInfoService$1 = getServiceSync(EService.IAppInfoService);
const profileService$3 = getServiceSync(EService.IProfileService);
class RuleList extends React.PureComponent {
  state = {
    ruleFileList: [],
    enableRule: true
  };
  unRule;
  unProfile;
  componentDidMount() {
    this.unRule = ruleService$5.subscribe((data) => {
      this.setState({ ruleFileList: data.ruleFileList });
    });
    this.unProfile = profileService$3.subscribe(() => {
      this.setState({ enableRule: profileService$3.getProfile().enableRule });
    });
  }
  componentWillUnmount() {
    this.unRule?.();
    this.unProfile?.();
  }
  async importRemoteRule() {
    const values = await openDialog(PromptForm, {
      title: "导入远程规则",
      fields: [
        { label: "请输入远程规则文件的url", key: "url", value: "", placeholder: "" },
        { label: "请输入导入规则的文件名", key: "name", value: "", placeholder: "" }
      ]
    });
    if (!values) {
      return;
    }
    const content = await getRemoteFile(values.url);
    content.meta = {
      remote: true,
      url: values.url
    };
    content.id = "";
    content.name = values.name;
    content.checked = false;
    const varNameList = ruleService$5.getReferenceVar(content);
    let infoStr;
    if (varNameList.length > 0) {
      infoStr = `导入规则文件名为${content.name},引用变量【${varNameList.join(
        "; "
      )}】请确保变量已经在转发路径变量中设置过`;
    } else {
      infoStr = `导入规则文件名为${content.name}`;
    }
    Modal.confirm({
      title: "导入远程规则",
      content: infoStr,
      onOk: async () => {
        try {
          await ruleService$5.saveRuleFile("", content);
          staticMethods.success("导入成功!");
        } catch (err) {
          staticMethods.error(`出错了，${err.message}`);
        }
      }
    });
  }
  async onDeleteFile(file, index) {
    await ruleService$5.deleteRuleFile(file.id);
    staticMethods.success("删除成功!");
  }
  onDownloadFile(file, index) {
    if (!file.meta.remote) {
      window.open("/rule/download?id=" + file.id, "_blank");
    } else {
      window.open(file.meta.url, "_blank");
    }
  }
  onShareFile(file, index) {
    const appInfo = appInfoService$1.getAppInfo();
    let url = `http://${appInfo.pcIp}:${appInfo.webUiPort}/rule/file/raw?id=${encodeURIComponent(file.id)}`;
    copyToClipboard(url);
    staticMethods.success(`已复制规则${file.name}链接`);
  }
  async toggleFileCheckStatus(file, index) {
    await ruleService$5.setFileCheckStatus(file.id, !file.checked);
  }
  getColumns() {
    const { enableRule: enableRule2 } = this.state;
    return [
      {
        title: "名字",
        dataIndex: "name",
        key: "name",
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: value })
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: value })
      },
      {
        title: "操作",
        key: "action",
        render: (_, ruleFile, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.onDeleteFile(ruleFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, children: "删除" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.onDownloadFile(ruleFile, index), children: "下载" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.onShareFile(ruleFile, index), children: "分享" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: `/editrule?id=${ruleFile.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", children: "编辑" }) })
          ] });
        }
      },
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: value,
            disabled: !enableRule2,
            onChange: (e) => this.toggleFileCheckStatus(ruleFile, index)
          }
        )
      }
    ];
  }
  render() {
    const { ruleFileList } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "规则集列表" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "http转发规则以规则集的方式组织，可以控制单个规则集是否启用。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rule-list-op", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "op", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => this.importRemoteRule(), children: "导入远程规则" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/createrulefile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", children: "新增规则集" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: ruleFileList, columns })
    ] });
  }
}
var EAction = /* @__PURE__ */ ((EAction2) => {
  EAction2["addQuery"] = "addQuery";
  EAction2["addRequestCookie"] = "addRequestCookie";
  EAction2["addRequestHeader"] = "addRequestHeader";
  EAction2["addResponseHeader"] = "addResponseHeader";
  EAction2["bypass"] = "bypass";
  EAction2["mockData"] = "mockData";
  EAction2["modifyResponse"] = "modifyResponse";
  EAction2["redirect"] = "redirect";
  EAction2["scriptModifyRequest"] = "scriptModifyRequest";
  EAction2["scriptModifyResponse"] = "scriptModifyResponse";
  return EAction2;
})(EAction || {});
function getDefaultRule() {
  return {
    name: "",
    id: "",
    method: "",
    match: "",
    checked: true,
    actionList: []
  };
}
function getDefaultAction() {
  return {
    type: EAction.redirect,
    // 转发redirect  接口转发api 使用数据文件替换data
    data: {
      target: "",
      // 转发目标路径
      dataId: "",
      //返回数据文件的id
      modifyResponseType: "",
      // 修改响应内容类型
      callbackName: "",
      // jsonp请求参数名
      cookieKey: "",
      // 设置到请求里的cookie key
      cookieValue: "",
      // 设置到请求里的cookie value
      reqHeaderKey: "",
      // 请求header
      reqHeaderValue: "",
      resHeaderKey: "",
      // 响应header
      resHeaderValue: "",
      queryKey: "",
      // 请求query
      queryValue: "",
      modifyRequestScript: "",
      // 脚本修改请求
      modifyResponseScript: ""
      // 脚本修改响应
    }
  };
}
const If = (props) => {
  const { condition, renderer } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: condition ? typeof renderer === "function" ? renderer() : renderer : null });
};
const ModifyResponseTypeOptions = [
  { value: "addTimestampToJsCss", label: "将html中的js、css请求加上时间戳" },
  { value: "returnDataInJsonpStyle", label: "以JSONP的方式返回数据" },
  { value: "allowCros", label: "增加跨域头部" },
  { value: "return404", label: "返回404" }
];
class ActionValue extends React.PureComponent {
  createNewDataFile() {
  }
  editDataFile(datafile) {
  }
  render() {
    const { action, mockDataList, onChange, allowRedirectToLocal, onTestTarget } = this.props;
    const mockDataOptions = mockDataList.map((item) => {
      return { value: item.id, label: item.name };
    });
    let datafileEntry = void 0;
    if (action.type == "mockData") {
      const finded = find(mockDataList, (entry) => {
        return entry.id == action.data.dataId;
      });
      if (finded) {
        datafileEntry = finded;
      }
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-value-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "redirect",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-redirect row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: action.data.target,
                onChange: (e) => onChange("target", e.target.value),
                size: "small",
                placeholder: allowRedirectToLocal ? "填写转发路径(远程地址、或者本地地址。远程地址需要以http/https开头)" : "填写转发路径(必须以http/https开头)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", size: "small", onClick: () => onTestTarget(action.data.target), children: "测试" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "mockData",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-mock-data", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: datafileEntry?.id || "",
                style: { width: 120 },
                placeholder: "请选择要返回的数据",
                onChange: (value) => onChange("dataId", value),
                options: mockDataOptions
              }
            ),
            datafileEntry && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", onClick: () => this.editDataFile(datafileEntry), children: "编辑数据" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", onClick: () => this.createNewDataFile(), children: "增加自定义数据" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "addRequestCookie",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Cookie Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.cookieKey,
                  onChange: (e) => onChange("cookieKey", e.target.value),
                  size: "small",
                  placeholder: "cookie key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row row-last", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Cookie Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.cookieValue,
                  onChange: (e) => onChange("cookieValue", e.target.value),
                  size: "small",
                  placeholder: "cookie value"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "addRequestHeader",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Header Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.reqHeaderKey,
                  onChange: (e) => onChange("reqHeaderKey", e.target.value),
                  size: "small",
                  placeholder: "header key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Header Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.reqHeaderValue,
                  onChange: (e) => onChange("reqHeaderValue", e.target.value),
                  size: "small",
                  placeholder: "header value"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "addQuery",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Query Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.queryKey,
                  onChange: (e) => onChange("queryKey", e.target.value),
                  size: "small",
                  placeholder: "query key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Query value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.queryValue,
                  onChange: (e) => onChange("queryValue", e.target.value),
                  size: "small",
                  placeholder: "query value"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "addResponseHeader",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Header Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.resHeaderKey,
                  onChange: (e) => onChange("resHeaderKey", e.target.value),
                  size: "small",
                  placeholder: "header key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "Header value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: action.data.resHeaderValue,
                  onChange: (e) => onChange("resHeaderValue", e.target.value),
                  size: "small",
                  placeholder: "header value"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "modifyResponse",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value-modify-response", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "action-data", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "v-if": "action.data.modifyResponseType == 'returnDataInJsonpStyle'", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: action.data.modifyResponseType,
                style: { width: 120 },
                size: "small",
                placeholder: "请选择修改返回body操作",
                onChange: (value) => onChange("modifyResponseType", value),
                options: ModifyResponseTypeOptions
              }
            ),
            action.data.modifyResponseType == "returnDataInJsonpStyle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: action.data.callbackName,
                onChange: (e) => onChange("callbackName", e.target.value),
                size: "small",
                placeholder: "jsonp callback参数名"
              }
            )
          ] }) }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "scriptModifyRequest",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value-script", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input.TextArea,
            {
              autoSize: { minRows: 10, maxRows: 10 },
              value: action.data.modifyRequestScript,
              onChange: (e) => onChange("modifyRequestScript", e.target.value)
            }
          ) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        If,
        {
          condition: action.type == "scriptModifyResponse",
          renderer: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value-script", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input.TextArea,
            {
              autoSize: { minRows: 10, maxRows: 10 },
              value: action.data.modifyResponseScript,
              onChange: (e) => onChange("modifyResponseScript", e.target.value)
            }
          ) })
        }
      )
    ] });
  }
}
const HttpInput = (props) => {
  const { id, value = {}, onChange, options } = props;
  const [method, setMethod] = reactExports.useState("");
  const [url, setUrl] = reactExports.useState("");
  const triggerChange = (changedValue) => {
    onChange?.({ method, url, ...value, ...changedValue });
  };
  const onMethodChange = (newMethod) => {
    if (!("method" in value)) {
      setMethod(newMethod);
    }
    triggerChange({ method: newMethod });
  };
  const onUrlChange = (e) => {
    const newUrl = e.target.value;
    if (!("url" in value)) {
      setUrl(newUrl);
    }
    triggerChange({ url: newUrl });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { id, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Select,
      {
        value: value?.method || method,
        style: { width: 80, margin: "0 8px" },
        onChange: onMethodChange,
        options
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: value?.url || url, onChange: onUrlChange, style: { width: 100 } })
  ] });
};
const ruleService$4 = getServiceSync(EService.IRuleService);
class RuleTestForm extends React.PureComponent {
  formRef = React.createRef();
  initialValue;
  constructor(props) {
    super(props);
    this.initialValue = {
      request: {
        method: "",
        url: ""
      },
      match: {
        method: props.matchMethod,
        url: this.props.matchUrl
      },
      target: props.target,
      // 转发目标
      matchResult: "",
      // 匹配结果
      redirectResult: "",
      // 转发结果
      message: ""
    };
  }
  async testMatchRule() {
    const values = this.formRef.current?.getFieldsValue();
    try {
      const result = await ruleService$4.testRule(values.match, values.target, values.request);
      this.formRef.current?.setFieldsValue({
        matchResult: result.matchResult,
        redirectResult: result.redirectResult,
        message: result.message
      });
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  render() {
    const { onCancel } = this.props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "匹配-转发 测试",
        open: true,
        okText: "测试",
        onOk: () => this.testMatchRule(),
        cancelText: "取消",
        onCancel: () => onCancel(void 0),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Form,
          {
            name: "configure",
            ref: this.formRef,
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            style: { maxWidth: 600 },
            initialValues: this.initialValue,
            autoComplete: "off",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "匹配规则", name: "match", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                HttpInput,
                {
                  options: [
                    { value: "", label: "所有" },
                    { value: "get", label: "GET" },
                    { value: "post", label: "POST" },
                    { value: "put", label: "PUT" },
                    { value: "patch", label: "PATCH" },
                    { value: "delete", label: "DELETE" },
                    { value: "options", label: "OPTIONS" }
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "转发路径", name: "target", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "请求", name: "request", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                HttpInput,
                {
                  options: [
                    { value: "get", label: "GET" },
                    { value: "post", label: "POST" },
                    { value: "put", label: "PUT" },
                    { value: "patch", label: "PATCH" },
                    { value: "delete", label: "DELETE" },
                    { value: "options", label: "OPTIONS" }
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "匹配结果", name: "matchResult", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { disabled: true }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "转发结果", name: "redirectResult", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { disabled: true }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "其他信息", name: "message", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, disabled: true }) })
            ]
          }
        )
      }
    );
  }
}
const MethodList = [
  { value: "", label: "所有" },
  { value: "get", label: "GET" },
  { value: "post", label: "POST" },
  { value: "put", label: "PUT" },
  { value: "patch", label: "PATCH" },
  { value: "delete", label: "DELETE" },
  { value: "options", label: "OPTIONS" }
];
const ActionTypeList_Filter = [
  //  {value: 'redirect', label: '转发请求'},
  //  {value: 'mockData', label: '返回自定义数据'},
  { value: "addQuery", label: "增加Query" },
  { value: "addRequestCookie", label: "设置请求cookie" },
  { value: "addRequestHeader", label: "增加请求头" },
  { value: "addResponseHeader", label: "增加响应头" },
  //  {value: 'modifyResponse', label: '修改响应内容'},
  { value: "scriptModifyRequest", label: "js修改请求内容" },
  { value: "scriptModifyResponse", label: "js修改响应内容" }
];
const ActionTypeList_Rule = [
  { value: "redirect", label: "转发请求" },
  { value: "mockData", label: "返回自定义数据" },
  { value: "addQuery", label: "增加Query" },
  { value: "addRequestCookie", label: "设置请求cookie" },
  { value: "addRequestHeader", label: "增加请求头" },
  { value: "addResponseHeader", label: "增加响应头" },
  { value: "modifyResponse", label: "修改响应内容" },
  { value: "scriptModifyRequest", label: "js修改请求内容" },
  { value: "scriptModifyResponse", label: "js修改响应内容" }
];
const mockDataService$3 = getServiceSync(EService.IDataFileService);
const userService$1 = getServiceSync(EService.IUserService);
class RuleEditForm extends React.PureComponent {
  unMockData;
  constructor(props) {
    super(props);
    this.state = {
      rule: JSON.parse(JSON.stringify(props.rule)),
      mockDataList: []
    };
  }
  componentDidMount() {
    this.unMockData = mockDataService$3.subscribe(() => {
      this.setState({ mockDataList: mockDataService$3.getDataFileEntryList() });
    });
  }
  componentWillUnmount() {
    this.unMockData?.();
  }
  setValue(path, value) {
    const nextRule = produce(this.state.rule, (draftRule) => {
      set(draftRule, path, value);
    });
    this.setState({ rule: nextRule });
  }
  handleOk() {
    this.props.onOk(this.state.rule);
  }
  addAction() {
    const { isFilterRule } = this.props;
    const initialAction = getDefaultAction();
    initialAction.type = isFilterRule ? EAction.addRequestHeader : EAction.redirect;
    const nextRule = produce(this.state.rule, (draftRule) => {
      draftRule.actionList.push(initialAction);
    });
    this.setState({ rule: nextRule });
  }
  deleteAction(action, index) {
    const nextRule = produce(this.state.rule, (draftRule) => {
      draftRule.actionList.splice(index, 1);
    });
    this.setState({ rule: nextRule });
  }
  testTarget(target) {
    const { rule } = this.state;
    openDialog(RuleTestForm, {
      matchMethod: rule.method,
      matchUrl: rule.match,
      target
    });
  }
  getColumns() {
    const isRoot = userService$1.isRoot();
    const { isFilterRule } = this.props;
    const { mockDataList } = this.state;
    return [
      {
        title: "动作",
        dataIndex: "type",
        key: "type",
        render: (value, action, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value,
            style: { width: 120 },
            onChange: (value2) => this.setValue(`actionList[${index}].type`, value2),
            options: isFilterRule ? ActionTypeList_Filter : ActionTypeList_Rule
          }
        )
      },
      {
        title: "参数",
        dataIndex: "data",
        key: "data",
        render: (data, action, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActionValue,
            {
              action,
              allowRedirectToLocal: isRoot,
              mockDataList,
              onChange: (path, value) => this.setValue(`actionList[${index}].data.${path}`, value),
              onTestTarget: (target) => this.testTarget(target)
            }
          );
        }
      },
      {
        title: "执行动作",
        key: "actionList",
        render: (_, action, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, onClick: () => this.deleteAction(action, index), children: "删除" });
        }
      }
    ];
  }
  render() {
    const { onCancel, isEditRule } = this.props;
    const { rule } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: isEditRule ? "编辑规则" : "新建规则",
        open: true,
        okText: isEditRule ? "保存规则" : "创建规则",
        onOk: () => this.handleOk(),
        onCancel: () => onCancel(void 0),
        footer: (_, { OkBtn, CancelBtn }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CancelBtn, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.addAction(), children: "新增动作" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OkBtn, {})
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-edit-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "config-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "config-name", children: "规则名:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "config-value", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: rule.name,
                onChange: (e) => this.setValue("name", e.target.value),
                size: "small",
                placeholder: "方便记忆规则"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "config-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "config-name", children: "匹配规则:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "config-value match-rule", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "match-method", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Select,
                  {
                    value: rule.method,
                    style: { width: 120 },
                    onChange: (value) => this.setValue("method", value),
                    options: MethodList
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tips", children: "不要忘记选择匹配请求方法" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "match-reg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: rule.match,
                    size: "small",
                    onChange: (e) => this.setValue("match", e.target.value),
                    placeholder: "填写要拦截的url中部分连续的字符串，或者匹配要拦截url的正则表达式"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", size: "small", onClick: () => this.testTarget(""), children: "测试" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rule-actions", children: "执行操作" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: (record, index) => index, dataSource: rule.actionList, columns }) })
        ] })
      }
    );
  }
}
const modifyResponseType = [
  { value: "addTimestampToJsCss", label: "将html中的js、css请求加上时间戳" },
  { value: "returnDataInJsonpStyle", label: "以JSONP的方式返回数据" },
  { value: "allowCros", label: "增加跨域头部" },
  { value: "return404", label: "返回404" }
];
class ActionView extends React.PureComponent {
  modifyResponseDescription() {
    const { action } = this.props;
    if (action.type == "modifyResponse") {
      const finded = find(modifyResponseType, (entry) => {
        return entry.value == action.data.modifyResponseType;
      });
      if (!finded) return "未知类型";
      if (finded.value != "returnDataInJsonpStyle") {
        return finded.label;
      }
      return finded.label + "( callback参数名: " + action.data.callbackName + " )";
    }
    return "";
  }
  render() {
    const { action, mockDataList } = this.props;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-value-container", children: [
      action.type == "redirect" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-redirect row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "转发" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: action.data.target })
      ] }),
      action.type == "mockData" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-mock-data row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "返回mock数据" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: mockDataList.find((item) => item.id == action.data.dataId)?.name })
      ] }),
      action.type == "addRequestCookie" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "设置请求Cookie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "value", children: [
          action.data.cookieKey,
          ":",
          action.data.cookieValue
        ] })
      ] }),
      action.type == "addRequestHeader" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "设置请求头" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "value", children: [
          action.data.reqHeaderKey,
          ":",
          action.data.reqHeaderValue
        ] })
      ] }),
      action.type == "addQuery" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "增加请求Query" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "value", children: [
          action.data.queryKey,
          ":",
          action.data.queryValue
        ] })
      ] }),
      action.type == "addResponseHeader" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "设置响应头" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "value", children: [
          action.data.resHeaderKey,
          ":",
          action.data.resHeaderValue
        ] })
      ] }),
      action.type == "modifyResponse" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-modify-response row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "修改响应Body" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: this.modifyResponseDescription() })
      ] }),
      action.type == "scriptModifyRequest" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-script row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "Js修改请求内容" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: action.data.modifyRequestScript })
      ] }),
      action.type == "scriptModifyResponse" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "value-script row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "name", children: "Js修改响应内容" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: action.data.modifyResponseScript })
      ] })
    ] });
  }
}
const ruleService$3 = getServiceSync(EService.IRuleService);
const mockDataService$2 = getServiceSync(EService.IDataFileService);
class EditRule extends React.PureComponent {
  state = {
    ruleFileId: "",
    loaded: false,
    mockDataList: []
  };
  unRule;
  unMockData;
  componentDidMount() {
    this.loadRuleFile();
    this.unMockData = mockDataService$2.subscribe(() => {
      this.setState({ mockDataList: mockDataService$2.getDataFileEntryList() });
    });
  }
  componentWillUnmount() {
    this.unRule?.();
    this.unMockData?.();
  }
  async loadRuleFile() {
    const query = getQueryParams();
    const id = query.id;
    const content = await ruleService$3.getFileContent(id);
    if (!content) {
      return;
    }
    this.setState({
      ruleFileId: id,
      loaded: true,
      ruleFile: content
    });
  }
  async addRule() {
    const rule = getDefaultRule();
    const action = getDefaultAction();
    action.type = EAction.redirect;
    rule.actionList.push(action);
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule
    });
    if (!nextFilter) {
      return;
    }
    const { ruleFileId } = this.state;
    await ruleService$3.saveRule(ruleFileId, nextFilter);
    staticMethods.success("保存成功!");
    this.loadRuleFile();
  }
  async toggleRuleCheckState(rule) {
    const { ruleFileId } = this.state;
    await ruleService$3.setRuleCheckedState(ruleFileId, rule.id, !rule.checked);
    staticMethods.success("设置成功!");
    this.loadRuleFile();
  }
  async deleteRule(rule, index) {
    const { ruleFileId } = this.state;
    await ruleService$3.removeRule(ruleFileId, rule.id);
    staticMethods.success("删除成功!");
    this.loadRuleFile();
  }
  async editRule(rule, index) {
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: true,
      isFilterRule: true,
      rule
    });
    if (!nextFilter) {
      return;
    }
    const { ruleFileId } = this.state;
    await ruleService$3.saveRule(ruleFileId, nextFilter);
    staticMethods.success("保存成功!");
    this.loadRuleFile();
  }
  async duplicateRule(rule, index) {
    const newRule = JSON.parse(JSON.stringify(rule));
    newRule.id = "";
    const { ruleFileId } = this.state;
    await ruleService$3.saveRuleFile(ruleFileId, newRule);
    staticMethods.success("复制成功!");
    this.loadRuleFile();
  }
  getColumns() {
    const { mockDataList } = this.state;
    return [
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: value, onChange: (e) => this.toggleRuleCheckState(rule) })
      },
      {
        title: "规则名",
        dataIndex: "name",
        key: "name",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "匹配方法",
        dataIndex: "method",
        key: "method",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value ? value : "全部" })
      },
      {
        title: "匹配路径",
        dataIndex: "match",
        key: "match",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "执行动作",
        dataIndex: "actionList",
        key: "actionList",
        render: (actionList, rule, index) => {
          return actionList.map((action, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActionView, { action, mockDataList }, index2));
        }
      },
      {
        title: "操作",
        key: "action",
        render: (_, rule, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteRule(rule, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, children: "删除" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.duplicateRule(rule, index), children: "复制" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.editRule(rule, index), children: "编辑" })
          ] });
        }
      }
    ];
  }
  render() {
    const { ruleFile, loaded } = this.state;
    const ruleList = ruleFile?.ruleList || [];
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "main-content__title", children: [
        "编辑规则集",
        loaded ? ": " + ruleFile?.name : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "可以控制单个规则是否启用，当规则所在规则集没有启用时，规则不管是否启用，都不会生效。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.addRule(), children: "新增过滤器" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: ruleList, columns })
    ] });
  }
}
const ruleService$2 = getServiceSync(EService.IRuleService);
const CreateRule = () => {
  const navigate = useNavigate();
  const onSave = async (values) => {
    try {
      const id = await ruleService$2.createFile(values.name, values.description);
      navigate(`/editrule?id=${id}`);
      staticMethods.success("创建成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "创建规则集" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        name: "创建规则集",
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        onFinish: onSave,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "规则集名字",
              name: "name",
              rules: [
                { type: "string", required: true, message: "请输入文件名称名称" },
                { type: "string", min: 2, max: 20, message: "长度在 2 到 20 个字符" }
              ],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "规则集名字" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "规则集描述",
              name: "description",
              rules: [{ required: true, message: "请输入文件描述" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: "规则集描述" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Form.Item, { label: null, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => navigate(-1), children: "返回" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "创建" })
          ] })
        ]
      }
    )
  ] });
};
const filterService$1 = getServiceSync(EService.IFilterService);
const profileService$2 = getServiceSync(EService.IProfileService);
const mockDataService$1 = getServiceSync(EService.IDataFileService);
class FilterList extends React.PureComponent {
  state = {
    filters: [],
    enableFilter: true,
    mockDataList: []
  };
  unFilter;
  unProfile;
  unMockData;
  componentDidMount() {
    this.unFilter = filterService$1.subscribe(() => {
      this.setState({ filters: filterService$1.getFilters() });
    });
    this.unProfile = profileService$2.subscribe(() => {
      this.setState({ enableFilter: profileService$2.getProfile().enableFilter });
    });
    this.unMockData = mockDataService$1.subscribe(() => {
      this.setState({ mockDataList: mockDataService$1.getDataFileEntryList() });
    });
  }
  componentWillUnmount() {
    this.unFilter?.();
    this.unProfile?.();
    this.unMockData?.();
  }
  async addFilter() {
    const rule = getDefaultRule();
    const action = getDefaultAction();
    action.type = EAction.addRequestHeader;
    rule.actionList.push(action);
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule
    });
    if (!nextFilter) {
      return;
    }
    await filterService$1.saveFilter(nextFilter);
    staticMethods.success("保存成功!");
  }
  async duplicateRule(rule, index) {
    const newRule = JSON.parse(JSON.stringify(rule));
    newRule.id = "";
    await filterService$1.saveFilter(newRule);
    staticMethods.success("复制成功!");
  }
  async editRule(rule, index) {
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: true,
      isFilterRule: true,
      rule
    });
    if (!nextFilter) {
      return;
    }
    await filterService$1.saveFilter(nextFilter);
    staticMethods.success("保存成功!");
  }
  async setFilterCheckedState(rule) {
    await filterService$1.setFilterCheckedState(rule.id, !rule.checked);
    staticMethods.success("设置成功!");
  }
  async deleteRule(rule, index) {
    await filterService$1.removeFilter(rule.id);
    staticMethods.success("删除成功!");
  }
  getColumns() {
    const { mockDataList, enableFilter: enableFilter2 } = this.state;
    return [
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: value,
            disabled: !enableFilter2,
            onChange: (e) => this.setFilterCheckedState(rule)
          }
        )
      },
      {
        title: "规则名",
        dataIndex: "name",
        key: "name",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "匹配方法",
        dataIndex: "method",
        key: "method",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value ? value : "全部" })
      },
      {
        title: "匹配路径",
        dataIndex: "match",
        key: "match",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "执行动作",
        dataIndex: "actionList",
        key: "actionList",
        render: (actionList, rule, index) => {
          return actionList.map((action, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActionView, { action, mockDataList }, index2));
        }
      },
      {
        title: "操作",
        key: "action",
        render: (_, rule, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteRule(rule, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, children: "删除" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.duplicateRule(rule, index), children: "复制" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.editRule(rule, index), children: "编辑" })
          ] });
        }
      }
    ];
  }
  render() {
    const { filters } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "过滤器" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.addFilter(), children: "新增过滤器" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: filters, columns })
    ] });
  }
}
var EContentType = /* @__PURE__ */ ((EContentType2) => {
  EContentType2["html"] = "text/html";
  EContentType2["json"] = "application/json";
  EContentType2["javascript"] = "application/javascript";
  return EContentType2;
})(EContentType || {});
const DataCreateForm = (props) => {
  const { onOk, onCancel } = props;
  const [form] = Form.useForm();
  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "新建Mock数据文件", open: true, onOk: () => handleOk(), onCancel: () => onCancel(void 0), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", name: "custom_prompt_form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "名称", name: "name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "名称", name: "contenttype", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Select,
      {
        style: { width: 80, margin: "0 8px" },
        options: [
          { value: EContentType.html, label: "html" },
          { value: EContentType.json, label: "json" },
          { value: EContentType.javascript, label: "javascript" }
        ]
      }
    ) })
  ] }) });
};
const ContentTypeLangMap = {
  [EContentType.html]: "html",
  [EContentType.json]: "json",
  [EContentType.javascript]: "javascript"
};
class DataEditForm extends React.PureComponent {
  editor;
  async handleOk() {
    const { onOk, onCancel, dataFileEntry } = this.props;
    const content = this.editor?.getValue();
    onOk(content);
  }
  componentDidMount() {
    const { dataFileEntry, content } = this.props;
    this.editor = editor.create(document.getElementById("content-editor-container"), {
      value: content,
      language: ContentTypeLangMap[dataFileEntry.contenttype] || "javascript",
      theme: "vs-dark",
      automaticLayout: true
    });
    setTimeout(() => {
      this.editor?.updateOptions({
        lineNumbers: "on"
      });
    }, 2e3);
  }
  componentWillUnmount() {
    this.editor?.dispose();
    this.editor = void 0;
  }
  render() {
    const { onCancel, dataFileEntry } = this.props;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "编辑Mock数据文件",
        open: true,
        onOk: () => this.handleOk(),
        onCancel: () => onCancel(void 0),
        footer: (_, { OkBtn, CancelBtn }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CancelBtn, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => {
          }, children: "全屏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => {
          }, children: "格式化" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OkBtn, {})
        ] }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "编辑数据文件 ",
            dataFileEntry.name,
            " [Content-Type: ",
            dataFileEntry.contenttype,
            "]"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "content-editor-container", style: { height: "305px" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Press ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "F11" }),
            " when cursor is in the editor to toggle full screen editing. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Esc" }),
            " ",
            "can also be used to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "exit" }),
            " full screen editing."
          ] })
        ]
      }
    );
  }
}
const dataFileService = getServiceSync(EService.IDataFileService);
class DataList extends React.PureComponent {
  state = {
    dataFileList: []
  };
  unMockData;
  componentDidMount() {
    this.unMockData = dataFileService.subscribe((data) => {
      this.setState({ dataFileList: data.dataFileList });
    });
  }
  componentWillUnmount() {
    this.unMockData?.();
  }
  async requestAddDataFile() {
    const entry = await openDialog(DataCreateForm, {});
    entry.id = v4();
    await dataFileService.createDataFileEntry(entry);
    staticMethods.success("创建成功!");
  }
  async requestEditDataFile(dataEntry, index) {
    const content = await dataFileService.getDataFile(dataEntry.id);
    const newContent = await openDialog(DataEditForm, {
      dataFileEntry: dataEntry,
      content
    });
    await dataFileService.saveDataFile(dataEntry.id, newContent);
    staticMethods.success("保存成功!");
  }
  async deleteDataFile(dataEntry, index) {
    await dataFileService.removeDataFileEntry(dataEntry);
    staticMethods.success("删除成功!");
  }
  getColumns() {
    return [
      {
        title: "名字",
        dataIndex: "name",
        key: "name",
        render: (value, mockFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "类型",
        dataIndex: "contenttype",
        key: "contenttype",
        render: (value, mockFile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
      },
      {
        title: "操作",
        key: "action",
        render: (_, mockFile, index) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteDataFile(mockFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", danger: true, children: "删除" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.requestEditDataFile(mockFile, index), children: "编辑" })
          ] });
        }
      }
    ];
  }
  render() {
    const columns = this.getColumns();
    const { dataFileList } = this.state;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "自定义数据文件列表" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "在http转发规则里面，可以配置将这里的mock数据返回给浏览器" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "top-op", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => this.requestAddDataFile(), children: "新增数据文件" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: dataFileList, columns })
    ] });
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/proxy-app-configure", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProxyConfigure, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/interception-config", element: /* @__PURE__ */ jsxRuntimeExports.jsx(InterceptionConfig, {}) }),
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
const profileService$1 = getServiceSync(EService.IProfileService);
const ruleService$1 = getServiceSync(EService.IRuleService);
const hostService$1 = getServiceSync(EService.IHostService);
class SettingHeader extends React.PureComponent {
  state = {
    enableFilter: false,
    enableHost: false,
    resolveIp: false,
    enableRule: false,
    ruleFileList: [],
    hostFileList: []
  };
  unProfile;
  unRule;
  unHost;
  componentDidMount() {
    this.unProfile = profileService$1.subscribe((data) => {
      this.setState({
        enableFilter: data.enableFilter,
        enableHost: data.enableHost,
        resolveIp: data.resolveIp,
        enableRule: data.enableRule
      });
    });
    this.unRule = ruleService$1.subscribe((data) => {
      this.setState({ ruleFileList: data.ruleFileList });
    });
    this.unHost = hostService$1.subscribe((data) => {
      this.setState({ hostFileList: data.hostFileList });
    });
  }
  componentWillUnmount() {
    this.unProfile?.();
    this.unRule?.();
    this.unHost?.();
  }
  async setResolveIp(value) {
    await profileService$1.setResolveIp(value);
  }
  async setEnableFilter(value) {
    await profileService$1.setEnableFilter(value);
  }
  async setEnableHost(value) {
    await profileService$1.setEnableHost(value);
  }
  async setEnableRule(value) {
    await profileService$1.setEnableRule(value);
  }
  async selectHostFile(id) {
    await hostService$1.useFile(id);
  }
  async selectRuleFile(ids) {
    const { ruleFileList } = this.state;
    const oldCheckedIds = ruleFileList.filter((item) => item.checked).map((item) => item.id);
    const oldIdSet = new Set(oldCheckedIds);
    const newIdSet = new Set(ids);
    for (let id of oldCheckedIds) {
      if (!newIdSet.has(id)) {
        await ruleService$1.setFileCheckStatus(id, false);
      }
    }
    for (let id of ids) {
      if (!oldIdSet.has(id)) {
        await ruleService$1.setFileCheckStatus(id, true);
      }
    }
  }
  render() {
    const { enableFilter: enableFilter2, enableHost: enableHost2, resolveIp, enableRule: enableRule2, ruleFileList, hostFileList } = this.state;
    const hostOptions = [];
    let selectedHostId = "";
    for (const hostFile of hostFileList) {
      if (hostFile.checked) {
        selectedHostId = hostFile.id;
      }
      hostOptions.push({ value: hostFile.id, label: hostFile.name });
    }
    const ruleOptions = [];
    let selectedRuleIds = [];
    for (const ruleFile of ruleFileList) {
      if (ruleFile.checked) {
        selectedRuleIds.push(ruleFile.id);
      }
      ruleOptions.push({ value: ruleFile.id, label: ruleFile.name });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "解析IP ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: resolveIp, onChange: (value, e) => this.setResolveIp(value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Host设置",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: selectedHostId,
            style: { width: 120 },
            size: "small",
            placeholder: "请选择修改返回body操作",
            onChange: (value) => this.selectHostFile(value),
            options: hostOptions
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: enableHost2, onChange: (value, e) => this.setEnableHost(value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Rule设置",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            mode: "multiple",
            value: selectedRuleIds,
            style: { width: 120 },
            size: "small",
            placeholder: "请选择修改返回body操作",
            onChange: (value) => this.selectRuleFile(value),
            options: ruleOptions
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: enableRule2, onChange: (value, e) => this.setEnableRule(value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "过滤器开关 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: enableFilter2, onChange: (value, e) => this.setEnableFilter(value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/monitor.html", target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "监控窗" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/help/index.html", target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "帮助中心" }) })
      ] })
    ] });
  }
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { style: { padding: 0, background: colorBgContainer }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingHeader, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ViewRouter, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { style: { textAlign: "center" }, children: [
        "Http Trick ©",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Created by tsxuehu"
      ] })
    ] })
  ] }) });
};
async function saveFile$2(content) {
  const response = await axios.post("/profile/savefile", content);
  assertAxiosRes(response);
}
async function disableRule() {
  const response = await axios.post(`/profile/setRuleState`);
  assertAxiosRes(response);
}
async function enableRule() {
  const response = await axios.post(`/profile/setRuleState?rulestate=1`);
  assertAxiosRes(response);
}
async function disableResolveIp() {
  const response = await axios.post(`/profile/setResolveIp`);
  assertAxiosRes(response);
}
async function enableResolveIp() {
  const response = await axios.post(`/profile/setResolveIp?resolve=1`);
  assertAxiosRes(response);
}
async function disableHost() {
  const response = await axios.post(`/profile/setHostState`);
  assertAxiosRes(response);
}
async function enableHost() {
  const response = await axios.post(`/profile/setHostState?hoststate=1`);
  assertAxiosRes(response);
}
async function disableFilter() {
  const response = await axios.post(`/profile/setFilterState`);
  assertAxiosRes(response);
}
async function enableFilter() {
  const response = await axios.post(`/profile/setFilterState?filterstate=1`);
  assertAxiosRes(response);
}
async function getUserId() {
  const response = await axios.get(`/profile/getUserId`);
  assertAxiosRes(response);
  return response.data.data.userId;
}
const appInfoService = getServiceSync(EService.IAppInfoService);
const configureService = getServiceSync(EService.IConfigureService);
const mockDataService = getServiceSync(EService.IDataFileService);
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
    userService.setUserId(userId);
  }
  initSocketIO() {
    const io = window.io;
    if (!io) {
      console.error("没有websock环境");
      return;
    }
    let socket = io("/manager");
    socket.on("appinfo", (data) => {
      appInfoService.setAppInfo(data);
    });
    socket.on("configure", (data) => {
      configureService.setConfig(data);
    });
    socket.on("profile", (data) => {
      profileService.setProfile(data);
    });
    socket.on("bindedDeviceList", (data) => {
      deviceService.setDeviceList(data);
    });
    socket.on("hostfilelist", (data) => {
      hostService.setHostFileList(data);
    });
    socket.on("rulefilelist", (data) => {
      ruleService.setRuleFileList(data);
    });
    socket.on("filters", (data) => {
      filterService.setFilters(data);
    });
    socket.on("datalist", (data) => {
      mockDataService.setDataFileEntryList(data);
    });
  }
}
class StateBase {
  __store;
  constructor(initialState) {
    this.__store = createStore((set2) => initialState);
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
  setAppInfo(appInfo) {
    this.setState(appInfo);
  }
  getAppInfo() {
    return this.getState();
  }
}
function saveFile$1(content) {
  return axios.post("/configure/savefile", content);
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
  async save(part) {
    const oldConfig = this.getState();
    await saveFile$1(Object.assign({}, oldConfig, part));
  }
  setConfig(config) {
    this.setState(config);
  }
  getConfig() {
    return this.getState();
  }
}
async function removeDataFile(content) {
  const response = await axios.post("/data/removedatafile", content);
  assertAxiosRes(response);
}
async function createDataFile(content) {
  const response = await axios.post("/data/createdatafile", content);
  assertAxiosRes(response);
}
async function getDataFile(id) {
  const response = await axios.get(`/data/getdatafile?id=${id}`);
  assertAxiosRes(response);
  return response.data.data;
}
async function saveDataFile(id, content) {
  var data = new FormData();
  data.append("content", content);
  const response = await axios.post(`/data/savedatafile?id=${id}`, data);
  assertAxiosRes(response);
}
class DataFileService extends StateBase {
  constructor() {
    super({ dataFileList: [] });
  }
  setDataFileEntryList(dataFileList) {
    this.setState({ dataFileList });
  }
  getDataFileEntryList() {
    return this.getState().dataFileList;
  }
  async createDataFileEntry(dataFileEntry) {
    await createDataFile(dataFileEntry);
  }
  async removeDataFileEntry(mockFile) {
    await removeDataFile(mockFile);
  }
  async getDataFile(id) {
    return await getDataFile(id);
  }
  async saveDataFile(id, content) {
    await saveDataFile(id, content);
  }
}
class DeviceService extends StateBase {
  constructor() {
    super({ deviceList: [] });
  }
  setDeviceList(deviceList) {
    this.setState({ deviceList });
  }
  getDeviceList() {
    return this.getState().deviceList;
  }
}
async function setFilterCheckedState(ruleId, checked) {
  const response = await axios.get("/filter/setRuleCheckedState", {
    params: {
      ruleId,
      checked: checked ? 1 : 0
    }
  });
  assertAxiosRes(response);
}
async function saveFilter(filter) {
  const response = await axios.post("/filter/saveRule", filter);
  assertAxiosRes(response);
}
async function removeFilter(ruleId) {
  const response = await axios.get("/filter/removeRule", {
    params: {
      ruleId
    }
  });
  assertAxiosRes(response);
}
class FilterService extends StateBase {
  constructor() {
    super({ filters: [] });
  }
  setFilters(filters) {
    this.setState({ filters });
  }
  getFilters() {
    return this.getState().filters;
  }
  async removeFilter(id) {
    await removeFilter(id);
  }
  async saveFilter(filter) {
    await saveFilter(filter);
  }
  async setFilterCheckedState(ruleId, checked) {
    await setFilterCheckedState(ruleId, checked);
  }
}
async function createFile$1(name, description) {
  const response = await axios.post("/host/create", {
    name,
    description
  });
  assertAxiosRes(response);
}
async function deleteFile$1(id) {
  const response = await axios.get(`/host/deletefile?id=${id}`);
  assertAxiosRes(response);
}
async function useFile(id) {
  const response = await axios.get(`/host/usefile?id=${id}`);
  assertAxiosRes(response);
}
async function getFileContent$1(id) {
  const response = await axios.get(`/host/getfile?id=${id}`);
  return response.data.data;
}
async function saveFile(id, content) {
  const response = await axios.post(`/host/savefile?id=${id}`, content);
  assertAxiosRes(response);
}
class HostService extends StateBase {
  constructor() {
    super({ hostFileList: [] });
  }
  setHostFileList(hostFileList) {
    this.setState({ hostFileList });
  }
  getHostFileList() {
    return this.getState().hostFileList;
  }
  async createFile(name, description) {
    await createFile$1(name, description);
  }
  async useFile(id) {
    await useFile(id);
  }
  async deleteFile(id) {
    await deleteFile$1(id);
  }
  async getFileContent(id) {
    return await getFileContent$1(id);
  }
  async saveFile(id, content) {
    await saveFile(id, content);
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
      resolveIp: false,
      externalProxy: false,
      externalHttpProxy: false,
      externalSocks5Proxy: true,
      httpProxyIp: "",
      httpProxyPort: 8888,
      socks5ProxyIp: "",
      socks5ProxyPort: 8889
    });
  }
  setProfile(profile) {
    this.setState(profile);
  }
  getProfile() {
    return this.getState();
  }
  async setResolveIp(value) {
    if (value) {
      await enableResolveIp();
    } else {
      await disableResolveIp();
    }
  }
  async setEnableFilter(value) {
    if (value) {
      await enableFilter();
    } else {
      await disableFilter();
    }
  }
  async setEnableHost(value) {
    if (value) {
      await enableHost();
    } else {
      await disableHost();
    }
  }
  async setEnableRule(value) {
    if (value) {
      await enableRule();
    } else {
      await disableRule();
    }
  }
  async saveRedirectPathVariables(variables) {
    const data = this.getState();
    let copyProfile = JSON.parse(JSON.stringify(data));
    copyProfile.redirectPathVariables = variables;
    await saveFile$2(copyProfile);
  }
  async saveProfile(part) {
    const oldConfig = this.getState();
    const newProfile = Object.assign({}, oldConfig, part);
    await saveFile$2(newProfile);
  }
}
async function createFile(name, description) {
  const response = await axios.post("/rule/create", {
    name,
    description
  });
  assertAxiosRes(response);
  return response.data.data;
}
async function deleteFile(id) {
  const response = await axios.get(`/rule/deletefile?id=${id}`);
  assertAxiosRes(response);
}
async function setFileCheckStatus(id, checked) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
  assertAxiosRes(response);
}
async function saveRuleFile(id, content) {
  const response = await axios.post(`/rule/saveRuleFile?id=${id}`, content);
  assertAxiosRes(response);
}
async function testRule(content) {
  const response = await axios.post("/rule/test", content);
  assertAxiosRes(response);
  return response.data.data;
}
async function getFileContent(id) {
  const response = await axios.get(`/rule/getfile?id=${id}`);
  assertAxiosRes(response);
  return response.data.data;
}
async function setRuleCheckedState(ruleFileId, ruleId, checked) {
  const response = await axios.get(`/rule/setRuleCheckedState`, {
    params: {
      ruleFileId,
      ruleId,
      checked: checked ? 1 : 0
    }
  });
  assertAxiosRes(response);
}
async function saveRule(ruleFileId, rule) {
  const response = await axios.post(`/rule/saveRule`, rule, {
    params: {
      ruleFileId
    }
  });
  assertAxiosRes(response);
}
async function removeRule(ruleFileId, ruleId) {
  const response = await axios.get(`/rule/removeRule`, {
    params: {
      ruleFileId,
      ruleId
    }
  });
  assertAxiosRes(response);
}
class RuleService extends StateBase {
  constructor() {
    super({ ruleFileList: [] });
  }
  getRuleFileList() {
    return this.getState().ruleFileList;
  }
  setRuleFileList(ruleFileList) {
    this.setState({ ruleFileList });
  }
  async testRule(match, target, request) {
    return await testRule({
      requestMethod: request.method,
      // 请求method
      requestUrl: request.url,
      // 请求url
      matchMethod: match.method,
      // 匹配method
      matchUrl: match.url,
      // 匹配url
      target
      // 转发末班
    });
  }
  getReferenceVar(content) {
    const contentStr = JSON.stringify(content);
    const reg1 = RegExp("<%=(.+?)%>", "g");
    const reg2 = RegExp("\\$\\{(.+?)\\}", "g");
    let result;
    const varObj = {};
    while ((result = reg1.exec(contentStr)) != null) {
      varObj[trim(result[1])] = 1;
    }
    while ((result = reg2.exec(contentStr)) != null) {
      varObj[trim(result[1])] = 1;
    }
    return keys(varObj);
  }
  async createFile(name, description) {
    const res = await createFile(name, description);
    return res.id;
  }
  async getFileContent(id) {
    return await getFileContent(id);
  }
  async setFileCheckStatus(ruleFileId, check) {
    await setFileCheckStatus(ruleFileId, check);
  }
  async saveRuleFile(id, content) {
    await saveRuleFile(id, content);
  }
  async deleteRuleFile(id) {
    await deleteFile(id);
  }
  async setRuleCheckedState(ruleFileId, ruleId, checked) {
    await setRuleCheckedState(ruleFileId, ruleId, checked);
  }
  async saveRule(ruleFileId, rule) {
    await saveRule(ruleFileId, rule);
  }
  async removeRule(ruleFileId, ruleId) {
    await removeRule(ruleFileId, ruleId);
  }
}
class UserService extends StateBase {
  constructor() {
    super({
      userId: "root"
    });
  }
  setUserId(userId) {
    this.setState({ userId });
  }
  isRoot() {
    const userId = this.getState().userId;
    return userId === "root";
  }
}
const services = {
  [EService.IWorkbenchService]: new WorkbenchService(),
  [EService.IUserService]: new UserService(),
  [EService.IAppInfoService]: new AppInfoService(),
  [EService.IConfigureService]: new ConfigureService(),
  [EService.IDataFileService]: new DataFileService(),
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
  window.__registry = registry;
  setServiceRegistry(registry);
  clientExports.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
  document.addEventListener(
    "keydown",
    function(event) {
      if ((event.ctrlKey || event.metaKey) && event.code == "KeyS") {
        event.preventDefault();
        return false;
      }
    },
    true
  );
  await workbenchService.start({});
}
init();
//# sourceMappingURL=manager.js.map
