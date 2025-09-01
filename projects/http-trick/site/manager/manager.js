import { g as getServiceSync, r as reactExports, u as useLocation, j as jsxDevRuntimeExports, M as Menu, L as Link, R as RefIcon, a as RefIcon$1, b as RefIcon$2, c as RefIcon$3, d as RefIcon$4, e as React, q as qrcode, s as staticMethods, F as Form, C as Checkbox, I as Input, B as Button, f as Radio, P as Popconfirm, h as ForwardTable, i as copyToClipboard, N as NavLink, p as produce, k as Row, l as Col, m as useNavigate, n as Modal, o as find, S as Select, t as set, v as editor, w as v4, x as Routes, y as Route, z as Navigate, A as Switch, D as Layout, E as theme, H as HashRouter, G as axios, J as trim, K as keys, O as ServiceRegistry, Q as setServiceRegistry, T as clientExports } from "./vendor.js";
import { o as openDialog, g as getRemoteFile, P as PromptForm, E as EContentType, a as getUserId, S as StateBase, c as createDataFile, r as removeDataFile, b as getDataFile, s as saveDataFile, d as assertAxiosRes, e as enableResolveIp, f as disableResolveIp, h as enableFilter, i as disableFilter, j as enableHost, k as disableHost, l as enableRule, m as disableRule, n as saveFile$2 } from "./data.js";
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
      icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$4, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
        lineNumber: 27,
        columnNumber: 13
      }, this),
      label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/helpinstall", children: "使用说明" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
        lineNumber: 28,
        columnNumber: 14
      }, this)
    }
  ];
  if (userService$3.isRoot()) {
    items.push({
      key: "/proxy-configure",
      icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
        lineNumber: 34,
        columnNumber: 13
      }, this),
      label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/proxy-app-configure", children: "代理程序设置" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
        lineNumber: 35,
        columnNumber: 14
      }, this)
    });
  }
  if (professionalVersion) {
    items.push(
      ...[
        {
          key: "/interception-config",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$1, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 44,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/interception-config", children: "请求拦截设置" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 45,
            columnNumber: 18
          }, this)
        },
        {
          key: "/redirect-path-variable",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$1, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 49,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/redirect-path-variable", children: "转发路径变量" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 50,
            columnNumber: 18
          }, this)
        },
        {
          key: "/hostfilelist",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$2, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 54,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/hostfilelist", children: "Host 管理" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 55,
            columnNumber: 18
          }, this)
        },
        {
          key: "/filter",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 59,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/filter", children: "Http 过滤器" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 60,
            columnNumber: 18
          }, this)
        },
        {
          key: "/rulefilelist",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 64,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/rulefilelist", children: "Http 转发" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 65,
            columnNumber: 18
          }, this)
        },
        {
          key: "/datalist",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 69,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/datalist", children: "自定义 mock 数据" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 70,
            columnNumber: 18
          }, this)
        },
        {
          key: "/device",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 74,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/device", children: "设备管理" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 75,
            columnNumber: 18
          }, this)
        }
      ]
    );
  } else {
    items.push(
      ...[
        {
          key: "/interception-config",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$1, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 84,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/interception-config", children: "请求拦截设置" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 85,
            columnNumber: 18
          }, this)
        },
        {
          key: "/rulefilelist",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 89,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/rulefilelist", children: "Http 转发" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 90,
            columnNumber: 18
          }, this)
        },
        {
          key: "/datalist",
          icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 94,
            columnNumber: 17
          }, this),
          label: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/datalist", children: "自定义 mock 数据" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
            lineNumber: 95,
            columnNumber: 18
          }, this)
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Menu, { theme: "dark", selectedKeys: [location.pathname], mode: "inline", items }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/menu.tsx",
    lineNumber: 124,
    columnNumber: 10
  }, this);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "install-body", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { children: "Http Trick" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 45,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { id: "toc_0", children: "一、说明" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 46,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "http trick是http协议代理工具，需要设置浏览器代理或者系统代理才能使用本工具。" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 48,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
        "远程PAC: ",
        remotePacUrl
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 49,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
        "本地PAC: ",
        localPacUrl
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 50,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { id: "toc_1", children: "二、chrome 代理插件安装(用于设置浏览器代理)" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 52,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
        "推荐安装 SwitchyOmega ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "a",
          {
            href: "https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped",
            target: "_blank",
            children: "点击安装代理插件"
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 54,
            columnNumber: 38
          },
          this
        )
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 54,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { id: "toc_2", children: "插件使用说明" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 58,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ol", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          "安装完插件后请设置插件代理地址为",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("code", { children: "127.0.0.1" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 61,
            columnNumber: 41
          }, this),
          "，代理协议: http，端口为",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("code", { children: "http trick" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 61,
            columnNumber: 78
          }, this),
          "代理端口(默认8001)。"
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 61,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          "如不清楚如何配置 SwitchyOmega，请参考 ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/help/chrome/", target: "_blank", children: "chrome 代理设置指南" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 64,
            columnNumber: 51
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 64,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 60,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { id: "toc_3", children: "三、证书安装" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 68,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { id: "toc_4", children: "1. 为什么需要安装证书" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 70,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
        "由于",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("code", { children: "http trick" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 72,
          columnNumber: 22
        }, this),
        "会代理 https 的请求，所以需要本地安装",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("code", { children: "http trick" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 72,
          columnNumber: 67
        }, this),
        "的https 证书。"
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 72,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { id: "toc_5", children: "2. 证书下载" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 75,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ol", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          "mac 系统请",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: certUrl, children: "点击下载到本地安装" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 78,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 78,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          "手机请扫码安装证书",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { className: "install-body__qrcode", src: imgUrl }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 80,
            columnNumber: 34
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 80,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          "证书信任请参考",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/help/cert/", target: "_blank", children: "如何信任证书" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
            lineNumber: 81,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
          lineNumber: 81,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
        lineNumber: 77,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/help/Help.tsx",
      lineNumber: 44,
      columnNumber: 13
    }, this);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "是否开启Http代理", name: "startHttpProxy", valuePropName: "checked", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 95,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 94,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "是否开启Socks5代理", name: "startSocks5", valuePropName: "checked", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 98,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 97,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "是否开启DNS服务", name: "startDns", valuePropName: "checked", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 101,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 100,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "是否开启专业版", name: "professionalVersion", valuePropName: "checked", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 104,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 103,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "Http代理端口",
              name: "httpProxyPort",
              rules: [{ required: true, message: "填写http代理端口号" }],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "http代理端口" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
                lineNumber: 112,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
              lineNumber: 107,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "Socks5端口",
              name: "socks5ProxyPort",
              rules: [{ required: true, message: "填写socks5代理端口" }],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "socks5代理端口" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
                lineNumber: 120,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
              lineNumber: 115,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "WebUi端口", name: "webUiPort", rules: [{ required: true, message: "填写WebUi端口" }], children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "WebUi端口" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 123,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 122,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "DNS端口", name: "dnsPort", rules: [{ required: true, message: "填写DNS端口" }], children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "DNS端口" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 126,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 125,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "超时时间",
              name: "requestTimeoutTime",
              rules: [{ required: true, message: "填写超时时间" }],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "超时时间" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
                lineNumber: 133,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
              lineNumber: 128,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: null, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", htmlType: "submit", children: "保存" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 136,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
            lineNumber: 135,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/ProxyConfigure.tsx",
        lineNumber: 83,
        columnNumber: 7
      },
      this
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "使用外部代理", name: "externalProxy", valuePropName: "checked", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, { children: "使用" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 94,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 93,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              noStyle: true,
              shouldUpdate: (prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy,
              children: (form) => {
                let externalProxy = form.getFieldValue("externalProxy");
                if (!externalProxy) {
                  return null;
                }
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "外部代理类型", name: "isSocks5Proxy", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Radio.Group,
                  {
                    options: [
                      { value: true, label: "Socks5代理" },
                      { value: false, label: "Http代理" }
                    ]
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                    lineNumber: 108,
                    columnNumber: 17
                  },
                  this
                ) }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 107,
                  columnNumber: 15
                }, this);
              }
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
              lineNumber: 96,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "Http代理 IP", name: "httpProxyIp", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Http代理 IP" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 133,
                  columnNumber: 17
                }, this) }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 132,
                  columnNumber: 15
                }, this);
              }
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
              lineNumber: 118,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "Http代理 Port", name: "httpProxyPort", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Http代理 Port" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 153,
                  columnNumber: 17
                }, this) }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 152,
                  columnNumber: 15
                }, this);
              }
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
              lineNumber: 138,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "Socks代理 IP", name: "socks5ProxyIp", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Socks代理 IP" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 173,
                  columnNumber: 17
                }, this) }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 172,
                  columnNumber: 15
                }, this);
              }
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
              lineNumber: 158,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "Socks代理 Port", name: "socks5ProxyPort", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Socks代理 Port" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 193,
                  columnNumber: 17
                }, this) }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
                  lineNumber: 192,
                  columnNumber: 15
                }, this);
              }
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
              lineNumber: 178,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "需要Http解析代理的域名", name: "goThroughProxyConfig", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: PlaceHolder$1 }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 199,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 198,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: null, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", htmlType: "submit", children: "保存" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 202,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
            lineNumber: 201,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/InterceptionConfig.tsx",
        lineNumber: 82,
        columnNumber: 7
      },
      this
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
        render: (value, record, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value, onChange: (e) => this.setKey(index, e.target.value), placeholder: "工程名" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
          lineNumber: 91,
          columnNumber: 11
        }, this)
      },
      {
        title: "变量值",
        dataIndex: "value",
        key: "value",
        render: (value, record, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Input,
          {
            value,
            onChange: (e) => this.setValue(index, e.target.value),
            placeholder: "工程在本地的绝对路径"
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
            lineNumber: 99,
            columnNumber: 11
          },
          this
        )
      },
      {
        title: "操作",
        key: "action",
        render: (_, record, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Popconfirm,
          {
            title: "确认",
            description: "确认删除?",
            onConfirm: () => this.deleteParam(index),
            okText: "确认",
            cancelText: "取消",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "link", children: "删除" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
              lineNumber: 112,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
            lineNumber: 107,
            columnNumber: 11
          },
          this
        )
      }
    ];
  }
  render() {
    const { redirectPathVariableArray } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-wraper", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "转发路径变量管理" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
        },
        void 0,
        true,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
          lineNumber: 125,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "key", dataSource: redirectPathVariableArray, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: { marginTop: "50px", textAlign: "right" }, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: () => this.addParam(), children: "增加工程路径设置" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
          lineNumber: 130,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.saveFile(), children: "保存" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/configure/RedirectPathVariable.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this);
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
        render: (value, hostFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 91,
          columnNumber: 81
        }, this)
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        render: (value, hostFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 97,
          columnNumber: 81
        }, this)
      },
      {
        title: "操作",
        key: "action",
        render: (_, hostFile, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.onDeleteFile(hostFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, children: "删除" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
                  lineNumber: 112,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
                lineNumber: 105,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.onShareFile(hostFile, index), children: "分享" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
              lineNumber: 116,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavLink, { to: `/edithost?id=${hostFile.id}`, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", children: "编辑" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
              lineNumber: 120,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
              lineNumber: 119,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
            lineNumber: 104,
            columnNumber: 13
          }, this);
        }
      },
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, hostFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Radio, { checked: value, disabled: !enableHost2, onChange: (e) => this.useFile(hostFile, index) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this)
      }
    ];
  }
  render() {
    const { hostFileList } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "host-view", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "Host 文件列表" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-path-info", children: "只允许一个host文件生效。" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "host-list-op", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", onClick: () => this.importRemoteHostFile(), children: "导入远程Host" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavLink, { to: "/createhostfile", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", children: "新增 Host 文件" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 148,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
        lineNumber: 143,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "id", dataSource: hostFileList, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
        lineNumber: 151,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/HostList.tsx",
      lineNumber: 140,
      columnNumber: 7
    }, this);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: [
        "编辑Host文件",
        loaded ? ": " + hostFile?.name : ""
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.saveFile(), children: "保存文件" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
        lineNumber: 65,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Input.TextArea,
        {
          value: hostFile?.content,
          autoSize: { minRows: 20, maxRows: 20 },
          onChange: (e) => this.onContentChange(e.target.value),
          placeholder: PlaceHolder
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
          lineNumber: 72,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/EditHost.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this);
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "创建Host文件" }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
      lineNumber: 32,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Form,
      {
        name: "创建规则集",
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        onFinish: onSave,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "文件名字",
              name: "name",
              rules: [
                { type: "string", required: true, message: "请输入文件名称名称" },
                { type: "string", min: 2, max: 20, message: "长度在 2 到 20 个字符" }
              ],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "文件名字" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
                lineNumber: 49,
                columnNumber: 11
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
              lineNumber: 41,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "文件描述", name: "description", rules: [{ required: true, message: "请输文件" }], children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: "文件描述" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
            lineNumber: 52,
            columnNumber: 11
          }, void 0) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
            lineNumber: 51,
            columnNumber: 9
          }, void 0),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: null, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", onClick: () => navigate(-1), children: "返回" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
              lineNumber: 55,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", htmlType: "submit", children: "创建" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
              lineNumber: 58,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
            lineNumber: 54,
            columnNumber: 9
          }, void 0)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
        lineNumber: 33,
        columnNumber: 7
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/host/CreateHost.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, void 0);
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
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
          lineNumber: 127,
          columnNumber: 79
        }, this)
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
          lineNumber: 133,
          columnNumber: 79
        }, this)
      },
      {
        title: "操作",
        key: "action",
        render: (_, ruleFile, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.onDeleteFile(ruleFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, children: "删除" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
                  lineNumber: 148,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
                lineNumber: 141,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.onDownloadFile(ruleFile, index), children: "下载" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
              lineNumber: 152,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.onShareFile(ruleFile, index), children: "分享" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
              lineNumber: 155,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavLink, { to: `/editrule?id=${ruleFile.id}`, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", children: "编辑" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
              lineNumber: 159,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
              lineNumber: 158,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
            lineNumber: 140,
            columnNumber: 13
          }, this);
        }
      },
      {
        title: "启用",
        dataIndex: "checked",
        key: "checked",
        render: (value, ruleFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Checkbox,
          {
            checked: value,
            disabled: !enableRule2,
            onChange: (e) => this.toggleFileCheckStatus(ruleFile, index)
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
            lineNumber: 170,
            columnNumber: 11
          },
          this
        )
      }
    ];
  }
  render() {
    const { ruleFileList } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "规则集列表" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
        lineNumber: 185,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-path-info", children: "http转发规则以规则集的方式组织，可以控制单个规则集是否启用。" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rule-list-op", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "op", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", onClick: () => this.importRemoteRule(), children: "导入远程规则" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavLink, { to: "/createrulefile", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", children: "新增规则集" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
          lineNumber: 193,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
        lineNumber: 188,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
        lineNumber: 187,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "id", dataSource: ruleFileList, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
        lineNumber: 197,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/RuleList.tsx",
      lineNumber: 184,
      columnNumber: 7
    }, this);
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: condition ? typeof renderer === "function" ? renderer() : renderer : null }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/logic/If.tsx",
    lineNumber: 11,
    columnNumber: 10
  }, void 0);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "action-value-container", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "redirect",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-redirect row", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: action.data.target,
                onChange: (e) => onChange("target", e.target.value),
                size: "small",
                placeholder: allowRedirectToLocal ? "填写转发路径(远程地址、或者本地地址。远程地址需要以http/https开头)" : "填写转发路径(必须以http/https开头)"
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 56,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "link", size: "small", onClick: () => onTestTarget(action.data.target), children: "测试" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 66,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 55,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 52,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "mockData",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-mock-data", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Select,
              {
                value: datafileEntry?.id || "",
                style: { width: 120 },
                placeholder: "请选择要返回的数据",
                onChange: (value) => onChange("dataId", value),
                options: mockDataOptions
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 76,
                columnNumber: 15
              },
              this
            ),
            datafileEntry && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "link", onClick: () => this.editDataFile(datafileEntry), children: "编辑数据" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 84,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "link", onClick: () => this.createNewDataFile(), children: "增加自定义数据" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 88,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 75,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 72,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "addRequestCookie",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Cookie Key" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 100,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.cookieKey,
                  onChange: (e) => onChange("cookieKey", e.target.value),
                  size: "small",
                  placeholder: "cookie key"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 101,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 99,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row row-last", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Cookie Value" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 109,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.cookieValue,
                  onChange: (e) => onChange("cookieValue", e.target.value),
                  size: "small",
                  placeholder: "cookie value"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 110,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 108,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 98,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 95,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "addRequestHeader",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Header Key" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 125,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.reqHeaderKey,
                  onChange: (e) => onChange("reqHeaderKey", e.target.value),
                  size: "small",
                  placeholder: "header key"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 126,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 124,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Header Value" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 134,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.reqHeaderValue,
                  onChange: (e) => onChange("reqHeaderValue", e.target.value),
                  size: "small",
                  placeholder: "header value"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 135,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 133,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 120,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "addQuery",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Query Key" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 150,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.queryKey,
                  onChange: (e) => onChange("queryKey", e.target.value),
                  size: "small",
                  placeholder: "query key"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 151,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 149,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Query value" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 159,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.queryValue,
                  onChange: (e) => onChange("queryValue", e.target.value),
                  size: "small",
                  placeholder: "query value"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 160,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 158,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 148,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 145,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "addResponseHeader",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Header Key" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 175,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.resHeaderKey,
                  onChange: (e) => onChange("resHeaderKey", e.target.value),
                  size: "small",
                  placeholder: "header key"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 176,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 174,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "label", children: "Header value" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 184,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input,
                {
                  value: action.data.resHeaderValue,
                  onChange: (e) => onChange("resHeaderValue", e.target.value),
                  size: "small",
                  placeholder: "header value"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                  lineNumber: 185,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 183,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 173,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 170,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "modifyResponse",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-modify-response", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "action-data", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { "v-if": "action.data.modifyResponseType == 'returnDataInJsonpStyle'", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Select,
              {
                value: action.data.modifyResponseType,
                style: { width: 120 },
                size: "small",
                placeholder: "请选择修改返回body操作",
                onChange: (value) => onChange("modifyResponseType", value),
                options: ModifyResponseTypeOptions
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 201,
                columnNumber: 19
              },
              this
            ),
            action.data.modifyResponseType == "returnDataInJsonpStyle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: action.data.callbackName,
                onChange: (e) => onChange("callbackName", e.target.value),
                size: "small",
                placeholder: "jsonp callback参数名"
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
                lineNumber: 210,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 200,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 199,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 198,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 195,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "scriptModifyRequest",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-script", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input.TextArea,
            {
              autoSize: { minRows: 10, maxRows: 10 },
              value: action.data.modifyRequestScript,
              onChange: (e) => onChange("modifyRequestScript", e.target.value)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 226,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 225,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 222,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        If,
        {
          condition: action.type == "scriptModifyResponse",
          renderer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-script", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input.TextArea,
            {
              autoSize: { minRows: 10, maxRows: 10 },
              value: action.data.modifyResponseScript,
              onChange: (e) => onChange("modifyResponseScript", e.target.value)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
              lineNumber: 238,
              columnNumber: 15
            },
            this
          ) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
            lineNumber: 237,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
          lineNumber: 234,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-value/ActionValue.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this);
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { id, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Select,
      {
        value: value?.method || method,
        style: { width: 80, margin: "0 8px" },
        onChange: onMethodChange,
        options
      },
      void 0,
      false,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/HttpInput.tsx",
        lineNumber: 35,
        columnNumber: 7
      },
      void 0
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "text", value: value?.url || url, onChange: onUrlChange, style: { width: 100 } }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/HttpInput.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/HttpInput.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, void 0);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Modal,
      {
        title: "匹配-转发 测试",
        open: true,
        okText: "测试",
        onOk: () => this.testMatchRule(),
        cancelText: "取消",
        onCancel: () => onCancel(void 0),
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "匹配规则", name: "match", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                  lineNumber: 88,
                  columnNumber: 13
                },
                this
              ) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 87,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "转发路径", name: "target", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {}, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 101,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 100,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "请求", name: "request", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                  lineNumber: 104,
                  columnNumber: 13
                },
                this
              ) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 103,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "匹配结果", name: "matchResult", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { disabled: true }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 116,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 115,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "转发结果", name: "redirectResult", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { disabled: true }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 119,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 118,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "其他信息", name: "message", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, disabled: true }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 122,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
                lineNumber: 121,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
            lineNumber: 78,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-test-form/RuleTestForm.tsx",
        lineNumber: 70,
        columnNumber: 7
      },
      this
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
        render: (value, action, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Select,
          {
            value,
            style: { width: 120 },
            onChange: (value2) => this.setValue(`actionList[${index}].type`, value2),
            options: isFilterRule ? ActionTypeList_Filter : ActionTypeList_Rule
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 133,
            columnNumber: 11
          },
          this
        )
      },
      {
        title: "参数",
        dataIndex: "data",
        key: "data",
        render: (data, action, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            ActionValue,
            {
              action,
              allowRedirectToLocal: isRoot,
              mockDataList,
              onChange: (path, value) => this.setValue(`actionList[${index}].data.${path}`, value),
              onTestTarget: (target) => this.testTarget(target)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
              lineNumber: 147,
              columnNumber: 13
            },
            this
          );
        }
      },
      {
        title: "执行动作",
        key: "actionList",
        render: (_, action, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, onClick: () => this.deleteAction(action, index), children: "删除" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 162,
            columnNumber: 13
          }, this);
        }
      }
    ];
  }
  render() {
    const { onCancel, isEditRule } = this.props;
    const { rule } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Modal,
      {
        title: isEditRule ? "编辑规则" : "新建规则",
        open: true,
        okText: isEditRule ? "保存规则" : "创建规则",
        onOk: () => this.handleOk(),
        onCancel: () => onCancel(void 0),
        footer: (_, { OkBtn, CancelBtn }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CancelBtn, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 184,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.addAction(), children: "新增动作" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 185,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(OkBtn, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 188,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
          lineNumber: 183,
          columnNumber: 11
        }, this),
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rule-edit-form", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "config-row", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "config-name", children: "规则名:" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
              lineNumber: 194,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "config-value", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: rule.name,
                onChange: (e) => this.setValue("name", e.target.value),
                size: "small",
                placeholder: "方便记忆规则"
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                lineNumber: 196,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
              lineNumber: 195,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 193,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "config-row", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "config-name", children: "匹配规则:" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
              lineNumber: 205,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "config-value match-rule", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "match-method", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Select,
                  {
                    value: rule.method,
                    style: { width: 120 },
                    onChange: (value) => this.setValue("method", value),
                    options: MethodList
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                    lineNumber: 208,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "tips", children: "不要忘记选择匹配请求方法" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                  lineNumber: 214,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                lineNumber: 207,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "match-reg", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    value: rule.match,
                    size: "small",
                    onChange: (e) => this.setValue("match", e.target.value),
                    placeholder: "填写要拦截的url中部分连续的字符串，或者匹配要拦截url的正则表达式"
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                    lineNumber: 217,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "link", size: "small", onClick: () => this.testTarget(""), children: "测试" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                  lineNumber: 223,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
                lineNumber: 216,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
              lineNumber: 206,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 204,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rule-actions", children: "执行操作" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 229,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: (record, index) => index, dataSource: rule.actionList, columns }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 231,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
            lineNumber: 230,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
          lineNumber: 192,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/rule-edit-form/RuleEditForm.tsx",
        lineNumber: 176,
        columnNumber: 7
      },
      this
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "action-value-container", children: [
      action.type == "redirect" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-redirect row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "转发" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 42,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: action.data.target }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 43,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      action.type == "mockData" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-mock-data row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "返回mock数据" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 48,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: mockDataList.find((item) => item.id == action.data.dataId)?.name }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 49,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 47,
        columnNumber: 11
      }, this),
      action.type == "addRequestCookie" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "设置请求Cookie" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 54,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: [
          action.data.cookieKey,
          ":",
          action.data.cookieValue
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 55,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 53,
        columnNumber: 11
      }, this),
      action.type == "addRequestHeader" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "设置请求头" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 62,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: [
          action.data.reqHeaderKey,
          ":",
          action.data.reqHeaderValue
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this),
      action.type == "addQuery" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "增加请求Query" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 70,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: [
          action.data.queryKey,
          ":",
          action.data.queryValue
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 71,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 69,
        columnNumber: 11
      }, this),
      action.type == "addResponseHeader" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-key-value row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "设置响应头" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 78,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: [
          action.data.resHeaderKey,
          ":",
          action.data.resHeaderValue
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 79,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 77,
        columnNumber: 11
      }, this),
      action.type == "modifyResponse" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-modify-response row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "修改响应Body" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: this.modifyResponseDescription() }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 87,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 85,
        columnNumber: 11
      }, this),
      action.type == "scriptModifyRequest" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-script row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "Js修改请求内容" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 92,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: action.data.modifyRequestScript }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 93,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 91,
        columnNumber: 11
      }, this),
      action.type == "scriptModifyResponse" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value-script row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "name", children: "Js修改响应内容" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 98,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "value", children: action.data.modifyResponseScript }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
          lineNumber: 99,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/action-view/ActionView.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this);
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
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, { checked: value, onChange: (e) => this.toggleRuleCheckState(rule) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this)
      },
      {
        title: "规则名",
        dataIndex: "name",
        key: "name",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
          lineNumber: 128,
          columnNumber: 64
        }, this)
      },
      {
        title: "匹配方法",
        dataIndex: "method",
        key: "method",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value ? value : "全部" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
          lineNumber: 134,
          columnNumber: 64
        }, this)
      },
      {
        title: "匹配路径",
        dataIndex: "match",
        key: "match",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
          lineNumber: 140,
          columnNumber: 64
        }, this)
      },
      {
        title: "执行动作",
        dataIndex: "actionList",
        key: "actionList",
        render: (actionList, rule, index) => {
          return actionList.map((action, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ActionView, { action, mockDataList }, index2, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
            lineNumber: 148,
            columnNumber: 13
          }, this));
        }
      },
      {
        title: "操作",
        key: "action",
        render: (_, rule, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteRule(rule, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, children: "删除" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
                  lineNumber: 165,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
                lineNumber: 158,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.duplicateRule(rule, index), children: "复制" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
              lineNumber: 169,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.editRule(rule, index), children: "编辑" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
              lineNumber: 172,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
            lineNumber: 157,
            columnNumber: 13
          }, this);
        }
      }
    ];
  }
  render() {
    const { ruleFile, loaded } = this.state;
    const ruleList = ruleFile?.ruleList || [];
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: [
        "编辑规则集",
        loaded ? ": " + ruleFile?.name : ""
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 187,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-path-info", children: "可以控制单个规则是否启用，当规则所在规则集没有启用时，规则不管是否启用，都不会生效。" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 188,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.addRule(), children: "新增过滤器" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 193,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 192,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 191,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "id", dataSource: ruleList, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
        lineNumber: 198,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/EditRule.tsx",
      lineNumber: 186,
      columnNumber: 7
    }, this);
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "创建规则集" }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Form,
      {
        name: "创建规则集",
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        style: { maxWidth: 600 },
        onFinish: onSave,
        autoComplete: "off",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "规则集名字",
              name: "name",
              rules: [
                { type: "string", required: true, message: "请输入文件名称名称" },
                { type: "string", min: 2, max: 20, message: "长度在 2 到 20 个字符" }
              ],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "规则集名字" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
                lineNumber: 48,
                columnNumber: 11
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
              lineNumber: 40,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Form.Item,
            {
              label: "规则集描述",
              name: "description",
              rules: [{ required: true, message: "请输入文件描述" }],
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input.TextArea, { autoSize: { minRows: 10, maxRows: 10 }, placeholder: "规则集描述" }, void 0, false, {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
                lineNumber: 55,
                columnNumber: 11
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
              lineNumber: 50,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: null, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", onClick: () => navigate(-1), children: "返回" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
              lineNumber: 58,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", htmlType: "submit", children: "创建" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
              lineNumber: 61,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
            lineNumber: 57,
            columnNumber: 9
          }, void 0)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
        lineNumber: 32,
        columnNumber: 7
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/rule/CreateRule.tsx",
    lineNumber: 30,
    columnNumber: 5
  }, void 0);
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
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Checkbox,
          {
            checked: value,
            disabled: !enableFilter2,
            onChange: (e) => this.setFilterCheckedState(rule)
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
            lineNumber: 112,
            columnNumber: 11
          },
          this
        )
      },
      {
        title: "规则名",
        dataIndex: "name",
        key: "name",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
          lineNumber: 123,
          columnNumber: 64
        }, this)
      },
      {
        title: "匹配方法",
        dataIndex: "method",
        key: "method",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value ? value : "全部" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
          lineNumber: 129,
          columnNumber: 64
        }, this)
      },
      {
        title: "匹配路径",
        dataIndex: "match",
        key: "match",
        render: (value, rule, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
          lineNumber: 135,
          columnNumber: 64
        }, this)
      },
      {
        title: "执行动作",
        dataIndex: "actionList",
        key: "actionList",
        render: (actionList, rule, index) => {
          return actionList.map((action, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ActionView, { action, mockDataList }, index2, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this));
        }
      },
      {
        title: "操作",
        key: "action",
        render: (_, rule, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteRule(rule, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, children: "删除" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
                  lineNumber: 160,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
                lineNumber: 153,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.duplicateRule(rule, index), children: "复制" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
              lineNumber: 164,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.editRule(rule, index), children: "编辑" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
              lineNumber: 167,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
            lineNumber: 152,
            columnNumber: 13
          }, this);
        }
      }
    ];
  }
  render() {
    const { filters } = this.state;
    const columns = this.getColumns();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "过滤器" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 182,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-path-info", children: "一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 183,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Col, { span: 6, offset: 16, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.addFilter(), children: "新增过滤器" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 188,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 187,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "id", dataSource: filters, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
        lineNumber: 193,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/filter/FilterList.tsx",
      lineNumber: 181,
      columnNumber: 7
    }, this);
  }
}
const DataCreateForm = (props) => {
  const { onOk, onCancel } = props;
  const [form] = Form.useForm();
  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Modal, { title: "新建Mock数据文件", open: true, onOk: () => handleOk(), onCancel: () => onCancel(void 0), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form, { form, layout: "vertical", name: "custom_prompt_form", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "名称", name: "name", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
      lineNumber: 27,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
      lineNumber: 26,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form.Item, { label: "名称", name: "contenttype", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Select,
      {
        style: { width: 80, margin: "0 8px" },
        options: [
          { value: EContentType.html, label: "html" },
          { value: EContentType.json, label: "json" },
          { value: EContentType.javascript, label: "javascript" }
        ]
      },
      void 0,
      false,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
        lineNumber: 30,
        columnNumber: 11
      },
      void 0
    ) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
    lineNumber: 25,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-create-form/DataCreateForm.tsx",
    lineNumber: 24,
    columnNumber: 5
  }, void 0);
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Modal,
      {
        title: "编辑Mock数据文件",
        open: true,
        onOk: () => this.handleOk(),
        onCancel: () => onCancel(void 0),
        footer: (_, { OkBtn, CancelBtn }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CancelBtn, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 63,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => {
          }, children: "全屏" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 64,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => {
          }, children: "格式化" }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 67,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(OkBtn, {}, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 70,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
          lineNumber: 62,
          columnNumber: 11
        }, this),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            "编辑数据文件 ",
            dataFileEntry.name,
            " [Content-Type: ",
            dataFileEntry.contenttype,
            "]"
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 74,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { id: "content-editor-container", style: { height: "305px" } }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 77,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            "Press ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: "F11" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
              lineNumber: 79,
              columnNumber: 17
            }, this),
            " when cursor is in the editor to toggle full screen editing. ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: "Esc" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
              lineNumber: 79,
              columnNumber: 98
            }, this),
            " ",
            "can also be used to ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("i", { children: "exit" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
              lineNumber: 80,
              columnNumber: 31
            }, this),
            " full screen editing."
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
            lineNumber: 78,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/data-edit-form/DataEditForm.tsx",
        lineNumber: 56,
        columnNumber: 7
      },
      this
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
        render: (value, mockFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
          lineNumber: 65,
          columnNumber: 77
        }, this)
      },
      {
        title: "类型",
        dataIndex: "contenttype",
        key: "contenttype",
        render: (value, mockFile, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: value }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
          lineNumber: 71,
          columnNumber: 77
        }, this)
      },
      {
        title: "操作",
        key: "action",
        render: (_, mockFile, index) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Popconfirm,
              {
                title: "确认",
                description: "确认删除?",
                onConfirm: () => this.deleteDataFile(mockFile, index),
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", danger: true, children: "删除" }, void 0, false, {
                  fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
                  lineNumber: 86,
                  columnNumber: 17
                }, this)
              },
              void 0,
              false,
              {
                fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
                lineNumber: 79,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "primary", onClick: () => this.requestEditDataFile(mockFile, index), children: "编辑" }, void 0, false, {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
              lineNumber: 90,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
            lineNumber: 78,
            columnNumber: 13
          }, this);
        }
      }
    ];
  }
  render() {
    const columns = this.getColumns();
    const { dataFileList } = this.state;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "main-content__title", children: "自定义数据文件列表" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "project-path-info", children: "在http转发规则里面，可以配置将这里的mock数据返回给浏览器" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
        lineNumber: 106,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "top-op", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "small", onClick: () => this.requestAddDataFile(), children: "新增数据文件" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
        lineNumber: 108,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ForwardTable, { rowKey: "id", dataSource: dataFileList, columns }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
        lineNumber: 112,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/data/DataList.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this);
  }
}
class DeviceList extends React.PureComponent {
  render() {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "DeviceList" }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/views/device/DeviceList.tsx",
      lineNumber: 9,
      columnNumber: 16
    }, this);
  }
}
function ViewRouter() {
  return (
    // <Suspense>
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Routes, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Navigate, { to: "/helpinstall" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 40,
        columnNumber: 34
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/helpinstall", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Help, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 41,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/proxy-app-configure", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProxyConfigure, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 43,
        columnNumber: 53
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/interception-config", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(InterceptionConfig, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 44,
        columnNumber: 53
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/redirect-path-variable", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RedirectPathVariable, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 45,
        columnNumber: 56
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/hostfilelist", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HostList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 47,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/edithost", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EditHost, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 48,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/createhostfile", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreateHost, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 49,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/rulefilelist", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RuleList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 51,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/editrule", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EditRule, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 52,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/createrulefile", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreateRule, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 53,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 53,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/filter", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FilterList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 55,
        columnNumber: 40
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/datalist", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DataList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 57,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 57,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/device", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DeviceList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 59,
        columnNumber: 40
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/config/router.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this)
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "setting-header", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
        "解析IP ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: resolveIp, onChange: (value, e) => this.setResolveIp(value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 112,
          columnNumber: 16
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
        "Host设置",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Select,
          {
            value: selectedHostId,
            style: { width: 120 },
            size: "small",
            placeholder: "请选择修改返回body操作",
            onChange: (value) => this.selectHostFile(value),
            options: hostOptions
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
            lineNumber: 116,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: enableHost2, onChange: (value, e) => this.setEnableHost(value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 124,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
        lineNumber: 114,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
        "Rule设置",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Select,
          {
            mode: "multiple",
            value: selectedRuleIds,
            style: { width: 120 },
            size: "small",
            placeholder: "请选择修改返回body操作",
            onChange: (value) => this.selectRuleFile(value),
            options: ruleOptions
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
            lineNumber: 128,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: enableRule2, onChange: (value, e) => this.setEnableRule(value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 137,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
        "过滤器开关 ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: enableFilter2, onChange: (value, e) => this.setEnableFilter(value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 140,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/monitor.html", target: "_blank", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { children: "监控窗" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/help/index.html", target: "_blank", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { children: "帮助中心" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/components/setting-header/SettingHeader.tsx",
      lineNumber: 110,
      columnNumber: 7
    }, this);
  }
}
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HashRouter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { style: { minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sider, { collapsible: true, collapsed, onCollapse: (value) => setCollapsed(value), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HttpTrickMenu, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
      lineNumber: 22,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
      lineNumber: 21,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Header, { style: { padding: 0, background: colorBgContainer }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SettingHeader, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
        lineNumber: 26,
        columnNumber: 13
      }, void 0) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
        lineNumber: 25,
        columnNumber: 11
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ViewRouter, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
        lineNumber: 29,
        columnNumber: 13
      }, void 0) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
        lineNumber: 28,
        columnNumber: 11
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Footer, { style: { textAlign: "center" }, children: [
        "Http Trick ©",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Created by tsxuehu"
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
        lineNumber: 31,
        columnNumber: 11
      }, void 0)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
      lineNumber: 24,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
    lineNumber: 20,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/App.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, void 0);
};
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
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(reactExports.StrictMode, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(App, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/main.tsx",
      lineNumber: 20,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/main.tsx",
      lineNumber: 19,
      columnNumber: 5
    }, this)
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
