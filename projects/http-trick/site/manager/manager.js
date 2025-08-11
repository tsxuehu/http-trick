import { g as getServiceSync, r as reactExports, u as useLocation, j as jsxRuntimeExports, M as Menu, L as Link, R as RefIcon, a as RefIcon$1, b as RefIcon$2, c as RefIcon$3, d as RefIcon$4, e as React, q as qrcode, s as staticMethods, F as Form, C as Checkbox, I as Input, B as Button, f as Radio, P as Popconfirm, h as ForwardTable, i as find, k as Future, l as clientExports, S as Select, p as produce, m as set, n as Modal, o as Row, t as Col, v as Routes, w as Route, N as Navigate, x as Layout, y as theme, H as HashRouter, z as axios, A as createStore, D as ServiceRegistry, E as setServiceRegistry } from "./vendor.js";
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
const configureService$2 = getServiceSync(EService.IConfigureService);
const userService$3 = getServiceSync(EService.IUserService);
function getMenuItems() {
  const professionalVersion = configureService$2.getState().professionalVersion;
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
    items.push(...[
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
    ]);
  } else {
    items.push(...[
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
    ]);
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
const appInfoService$1 = getServiceSync(EService.IAppInfoService);
const userService$2 = getServiceSync(EService.IUserService);
class Help extends React.PureComponent {
  state = {
    appInfo: appInfoService$1.getState(),
    userInfo: userService$2.getState()
  };
  componentDidMount() {
    userService$2.subscribe((userInfo) => {
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
  formInitialValue = getFormDataFromProfile$1(configureService$1.getState());
  unConfig;
  componentDidMount() {
    this.unConfig = configureService$1.subscribe(() => {
      const newFormValue = getFormDataFromProfile$1(configureService$1.getState());
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "是否开启Http代理",
              name: "startHttpProxy",
              valuePropName: "checked",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "是否开启Socks5代理",
              name: "startSocks5",
              valuePropName: "checked",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "是否开启DNS服务",
              name: "startDns",
              valuePropName: "checked",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "是否开启专业版",
              name: "professionalVersion",
              valuePropName: "checked",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, {})
            }
          ),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "WebUi端口",
              name: "webUiPort",
              rules: [{ required: true, message: "填写WebUi端口" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "WebUi端口" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "DNS端口",
              name: "dnsPort",
              rules: [{ required: true, message: "填写DNS端口" }],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "DNS端口" })
            }
          ),
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
const profileService$3 = getServiceSync(EService.IProfileService);
const PlaceHolder = `#示例
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
  formInitialValue = getFormDataFromProfile(profileService$3.getState());
  unProfile;
  componentDidMount() {
    this.unProfile = profileService$3.subscribe(() => {
      const newFormValue = getFormDataFromProfile(profileService$3.getState());
      this.formRef.current?.setFieldsValue(newFormValue);
    });
  }
  componentWillUnmount() {
    this.unProfile?.();
  }
  onSave = async (values) => {
    try {
      await profileService$3.saveProfile({
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "使用外部代理",
              name: "externalProxy",
              valuePropName: "checked",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { children: "使用" })
            }
          ),
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
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    label: "外部代理类型",
                    name: "isSocks5Proxy",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Radio.Group,
                      {
                        options: [
                          { value: true, label: "Socks5代理" },
                          { value: false, label: "Http代理" }
                        ]
                      }
                    )
                  }
                );
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
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    label: "Http代理 IP",
                    name: "httpProxyIp",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Http代理 IP" })
                  }
                );
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
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    label: "Http代理 Port",
                    name: "httpProxyPort",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Http代理 Port" })
                  }
                );
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
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    label: "Socks代理 IP",
                    name: "socks5ProxyIp",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Socks代理 IP" })
                  }
                );
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
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    label: "Socks代理 Port",
                    name: "socks5ProxyPort",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Socks代理 Port" })
                  }
                );
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              label: "需要Http解析代理的域名",
              name: "goThroughProxyConfig",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: PlaceHolder })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "保存" }) })
        ]
      }
    );
  }
}
const profileService$2 = getServiceSync(EService.IProfileService);
class RedirectPathVariable extends React.PureComponent {
  state = {
    redirectPathVariableArray: []
  };
  componentDidMount() {
    profileService$2.subscribe((userProfile) => {
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
      await profileService$2.saveRedirectPathVariables(redirectPathVariableMap);
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
  doTestRule(index) {
  }
  createNewDataFile() {
  }
  editDataFile(datafile) {
  }
  render() {
    const { action, mockDataList, onChange, allowRedirectToLocal } = this.props;
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", size: "small", onClick: () => this.doTestRule(-1), children: "测试" })
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
    type: "redirect",
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
const mockDataService$2 = getServiceSync(EService.IMockDataService);
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
    this.unMockData = mockDataService$2.subscribe(() => {
      this.setState({ mockDataList: mockDataService$2.getMockFileList() });
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
    initialAction.type = isFilterRule ? "addRequestHeader" : "redirect";
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
  doTestRule(index) {
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
              onChange: (path, value) => this.setValue(`actionList[${index}].data.${path}`, value)
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
        onCancel,
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", size: "small", onClick: () => this.doTestRule(-1), children: "测试" })
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
const filterService$1 = getServiceSync(EService.IFilterService);
const profileService$1 = getServiceSync(EService.IProfileService);
const mockDataService$1 = getServiceSync(EService.IMockDataService);
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
    this.unProfile = profileService$1.subscribe(() => {
      this.setState({ enableFilter: profileService$1.getState().enableFilter });
    });
    this.unMockData = mockDataService$1.subscribe(() => {
      this.setState({ mockDataList: mockDataService$1.getMockFileList() });
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
    action.type = "addRequestHeader";
    rule.actionList.push(action);
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule
    });
    try {
      await filterService$1.saveFilter(nextFilter);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  async duplicateRule(rule, index) {
    const newRule = JSON.parse(JSON.stringify(rule));
    newRule.id = "";
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule
    });
    try {
      await filterService$1.saveFilter(nextFilter);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  async editRule(rule, index) {
    const nextFilter = await openDialog(RuleEditForm, {
      isEditRule: true,
      isFilterRule: true,
      rule
    });
    try {
      await filterService$1.saveFilter(nextFilter);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  async toggleRuleCheckState(rule) {
    try {
      await filterService$1.setFilterCheckedState(rule.id, !rule.checked);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  async deleteRule(rule, index) {
    try {
      await filterService$1.removeFilter(rule.id);
      staticMethods.success("保存成功!");
    } catch (err) {
      staticMethods.error(`出错了，${err.message}`);
    }
  }
  getColumns() {
    const { mockDataList, enableFilter: enableFilter2 } = this.state;
    return [
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { value, disabled: !enableFilter2, onChange: (e) => this.toggleRuleCheckState(rule), children: "Checkbox" })
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
    console.log(this.state);
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content__title", children: "过滤器" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-path-info", children: "一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => this.addFilter(), children: "新增过滤器" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: "id", dataSource: filters, columns })
    ] });
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
function assertAxiosRes(response) {
  const serverData = response.data;
  if (serverData.code !== 0) {
    throw new Error(serverData.msg);
  }
}
async function saveFile$1(content) {
  const response = await axios.post("/profile/savefile", content);
  assertAxiosRes(response);
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
      ruleService.setRuleFileList(data);
    });
    socket.on("filters", (data) => {
      filterService.setFilters(data);
    });
    socket.on("datalist", (data) => {
      mockDataService.setMockFileList(data);
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
}
function saveFile(content) {
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
    await saveFile(Object.assign({}, oldConfig, part));
  }
}
class MockFileService extends StateBase {
  constructor() {
    super({ mockFileList: [] });
  }
  setMockFileList(mockFileList) {
    this.setState({ mockFileList });
  }
  getMockFileList() {
    return this.getState().mockFileList;
  }
}
class DeviceService extends StateBase {
  constructor() {
    super([]);
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
async function useFile(id) {
  const response = await axios.get(`/host/usefile?id=${id}`);
  assertAxiosRes(response);
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
    await saveFile$1(copyProfile);
  }
  async saveProfile(part) {
    const oldConfig = this.getState();
    const newProfile = Object.assign({}, oldConfig, part);
    await saveFile$1(newProfile);
  }
}
async function setFileCheckStatus(id, checked) {
  const response = await axios.get(`/rule/setfilecheckstatus?id=${id}&checked=${checked ? 1 : 0}`);
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
  [EService.IMockDataService]: new MockFileService(),
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
