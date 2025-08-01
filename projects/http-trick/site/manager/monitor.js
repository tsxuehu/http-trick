import { i as Layout, r as reactExports, t as theme, j as jsxRuntimeExports, M as Menu, B as Breadcrumb, n as RefIcon, o as RefIcon$1, a as RefIcon$2, p as RefIcon$3, v as RefIcon$4, g as getServiceSync, S as ServiceRegistry, s as setServiceRegistry, m as clientExports } from "./vendor.js";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label
  };
}
const items = [
  getItem("Option 1", "1", /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {})),
  getItem("Option 2", "2", /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {})),
  getItem("User", "sub1", /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5")
  ]),
  getItem("Team", "sub2", /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}), [getItem("Team 1", "6"), getItem("Team 2", "8")]),
  getItem("Files", "9", /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}))
];
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { style: { minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Sider, { collapsible: true, collapsed, onCollapse: (value) => setCollapsed(value), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "demo-logo-vertical" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { theme: "dark", defaultSelectedKeys: ["1"], mode: "inline", items })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { style: { padding: 0, background: colorBgContainer } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { style: { margin: "0 16px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, { style: { margin: "16px 0" }, items: [{ title: "User" }, { title: "Bill" }] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Footer, { style: { textAlign: "center" }, children: [
        "Ant Design ©",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Created by Ant UED"
      ] })
    ] })
  ] });
};
var EService = /* @__PURE__ */ ((EService2) => {
  EService2["IWorkbenchService"] = "WorkbenchService";
  return EService2;
})(EService || {});
class WorkbenchService {
  async start(query) {
  }
}
const services = {
  [EService.IWorkbenchService]: new WorkbenchService()
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
