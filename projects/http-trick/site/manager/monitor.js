import { e as React, j as jsxDevRuntimeExports, U as cn, T as clientExports, M as Menu, V as RefIcon, W as RefIcon$1, g as getServiceSync, i as copyToClipboard, s as staticMethods, X as AutoSizer, Y as FixedSizeList, Z as debounce, _ as RefIcon$2, $ as RefIcon$3, a0 as RefIcon$4, I as Input, B as Button, a1 as Tabs, D as Layout, r as reactExports, E as theme, G as axios, p as produce, O as ServiceRegistry, Q as setServiceRegistry } from "./vendor.js";
import { o as openDialog, P as PromptForm, E as EContentType, p as saveDataEntryFromTraffic, d as assertAxiosRes, q as getUserInfo, S as StateBase } from "./data.js";
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
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/components/context-menu/ContextMenuWrapper.tsx",
        lineNumber: 36,
        columnNumber: 7
      },
      this
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
const RecordContextMenu = (props) => {
  const items = [
    { key: "saveData", icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/context-menu/record/RecordContextMenu.tsx",
      lineNumber: 12,
      columnNumber: 30
    }, void 0), label: "保存为mock数据" },
    { key: "copyUrl", icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$1, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/context-menu/record/RecordContextMenu.tsx",
      lineNumber: 13,
      columnNumber: 29
    }, void 0), label: "复制url" }
  ];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    Menu,
    {
      selectable: false,
      mode: "vertical",
      onClick: ({ item, key, keyPath, domEvent }) => {
        props.onClick(key);
        props.close();
      },
      items
    },
    void 0,
    false,
    {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/context-menu/record/RecordContextMenu.tsx",
      lineNumber: 17,
      columnNumber: 5
    },
    void 0
  );
};
const trafficService$7 = getServiceSync(EService.ITrafficService);
class RecordList extends React.PureComponent {
  state = {
    filteredRecordArray: [],
    rightClickedRecordId: -1,
    selectRecordId: -1
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$7.subscribe((state) => {
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
  onContextMenu(event, id) {
    event.preventDefault();
    trafficService$7.setRightClickedRecordId(id);
    showContextMenu({
      top: 100,
      left: 100,
      render: (close) => {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          RecordContextMenu,
          {
            close,
            onClick: (key) => {
              trafficService$7.setRightClickedRecordId(-1);
              if (key === "saveData") {
                this.saveData(id);
              } else if (key === "copyUrl") {
                this.copyUrl(id);
              }
            }
          },
          void 0,
          false,
          {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 59,
            columnNumber: 11
          },
          this
        );
      }
    });
  }
  copyUrl(id) {
    const recordMap = trafficService$7.getRecordMap();
    const record = recordMap[id];
    let request = record.originRequest;
    copyToClipboard(`${request.protocol}//${request.hostname}:${request.port}${request.path}`);
    staticMethods.success("已将url复制到剪切板");
  }
  async saveData(id) {
    const recordMap = trafficService$7.getRecordMap();
    const record = recordMap[id];
    if (!record.response) {
      staticMethods.warning("服务器还没有响应");
      return;
    }
    const values = await openDialog(PromptForm, {
      title: "保存为数据文件",
      fields: [{ label: "数据文件名", key: "name", value: "", placeholder: "" }]
    });
    if (!values) {
      return;
    }
    const contentType = record.response.headers["content-type"]?.split(";")[0] || EContentType.html;
    await saveDataEntryFromTraffic(id, values.name, contentType);
    staticMethods.success("保存成功");
  }
  onClickRow(id) {
    trafficService$7.setSelectRecordId(id);
  }
  renderRow(index, rowId, style) {
    const { selectRecordId, rightClickedRecordId } = this.state;
    const recordMap = trafficService$7.getRecordMap();
    const { response, requestData, originRequest } = recordMap[rowId];
    let duration;
    if (response) {
      duration = response?.remoteResponseEndTime - response?.remoteRequestBeginTime;
    }
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        style,
        onClick: () => this.onClickRow(rowId),
        className: cn("record row", {
          selected: selectRecordId === rowId,
          "right-clicked": rightClickedRecordId === rowId
        }),
        onContextMenu: (e) => this.onContextMenu(e, rowId),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-index", children: index + 1 }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 124,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-status", children: response?.statusCode }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 125,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-method", children: originRequest?.method }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 126,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-protocol", children: originRequest?.protocol }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 127,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-host", children: originRequest?.hostname }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 128,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-path", children: originRequest?.pathname }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 129,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-type", children: originRequest?.headers["content-type"] }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 130,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-device", children: originRequest?.deviceId }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 131,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-time", children: duration }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
            lineNumber: 132,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
        lineNumber: 115,
        columnNumber: 7
      },
      this
    );
  }
  render() {
    const { filteredRecordArray } = this.state;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "record-list", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "header row", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-index", children: "#" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-status", children: "Status" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-method", children: "Method" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-protocol", children: "Protocol" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-host", children: "Host" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-path", children: "Path" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-type", children: "Type" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-device", children: "Device" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 149,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "cell cell-time", children: "Time" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AutoSizer, { disableWidth: true, children: ({ height }) => {
        return (
          // @ts-ignore
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
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
            },
            void 0,
            false,
            {
              fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
              lineNumber: 156,
              columnNumber: 15
            },
            this
          )
        );
      } }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
        lineNumber: 152,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-list/RecordList.tsx",
      lineNumber: 140,
      columnNumber: 7
    }, this);
  }
}
const trafficService$6 = getServiceSync(EService.ITrafficService);
class TopBar extends React.PureComponent {
  state = {
    monitorState: trafficService$6.getMonitorState(),
    filter: trafficService$6.getLocalFilter()
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$6.subscribe((state) => {
      this.setState({ monitorState: state.monitorState, filter: state.filter });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  clearMonitorData() {
    trafficService$6.requestClearMonitorData();
  }
  setStopRecord(stop) {
    trafficService$6.requestSetStopRecord(stop);
  }
  setHost(host) {
    const { filter } = this.state;
    const newFilter = { ...filter, host };
    this.setState({ filter: newFilter });
    this.syncFilterToService(newFilter);
  }
  setPath(path) {
    const { filter } = this.state;
    const newFilter = { ...filter, path };
    this.setState({ filter: newFilter });
    this.syncFilterToService(newFilter);
  }
  syncFilterToService = debounce((filter) => {
    trafficService$6.requestSetFilter(filter);
  });
  render() {
    const { monitorState, filter } = this.state;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "top-bar", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: `icon-btn ${monitorState.overflow ? "overflow" : ""}`, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$2, { onClick: () => this.setStopRecord(false) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$3, { onClick: () => this.setStopRecord(true) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "icon-btn", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefIcon$4, { onClick: () => this.clearMonitorData() }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 71,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "tips ", style: { visibility: monitorState.overflow ? "initial" : "hidden" }, children: "记录已满，请清除历史记录" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "filters", children: [
        "Filter:",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Host", value: filter.host, onChange: (e) => this.setHost(e.target.value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
          lineNumber: 79,
          columnNumber: 11
        }, this),
        "/",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Path", value: filter.path, onChange: (e) => this.setPath(e.target.value) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
          lineNumber: 81,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "placeholder" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 83,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { className: "goto-manager", href: "/index.html", target: "_blank", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { children: "管理" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 85,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
        lineNumber: 84,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/top-bar/TopBar.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, this);
  }
}
const trafficService$5 = getServiceSync(EService.ITrafficService);
class Timeline extends React.PureComponent {
  state = {
    selectRecordId: -1,
    currentRequestBody: "",
    currentResponseBody: ""
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$5.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  render() {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "Timeline" }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Timeline.tsx",
      lineNumber: 38,
      columnNumber: 12
    }, this);
  }
}
const KeyValueList = (props) => {
  const { keyValueObj } = props;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "keyvalue-wrapper", children: Object.entries(keyValueObj).map(([key, value]) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "row", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "name", children: key }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/KeyValueList.tsx",
      lineNumber: 13,
      columnNumber: 11
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "value", children: value }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/KeyValueList.tsx",
      lineNumber: 14,
      columnNumber: 11
    }, void 0)
  ] }, key, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/KeyValueList.tsx",
    lineNumber: 12,
    columnNumber: 9
  }, void 0)) }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/KeyValueList.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, void 0);
};
const trafficService$4 = getServiceSync(EService.ITrafficService);
class Origin extends React.PureComponent {
  state = {
    selectRecordId: -1,
    currentRequestBody: "",
    currentResponseBody: ""
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$4.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  render() {
    const { selectRecordId, currentRequestBody } = this.state;
    const currentSelectRecord = trafficService$4.getRecordMap()[selectRecordId];
    if (!currentSelectRecord) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
        lineNumber: 42,
        columnNumber: 14
      }, this);
    }
    const originRequest = currentSelectRecord.originRequest;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Header" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 48,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyValueList, { keyValueObj: originRequest?.headers ?? {} }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Cookie" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 52,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyValueList, { keyValueObj: originRequest?.cookie ?? {} }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 53,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Query Params" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 56,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyValueList, { keyValueObj: originRequest?.query ?? {} }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
          lineNumber: 57,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Origin.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this);
  }
}
const trafficService$3 = getServiceSync(EService.ITrafficService);
class Request extends React.PureComponent {
  state = {
    selectRecordId: -1,
    currentRequestBody: "",
    currentResponseBody: ""
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$3.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  render() {
    const { selectRecordId, currentRequestBody } = this.state;
    const currentSelectRecord = trafficService$3.getRecordMap()[selectRecordId];
    if (!currentSelectRecord) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
        lineNumber: 42,
        columnNumber: 14
      }, this);
    }
    const requestData = currentSelectRecord.requestData;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Header" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
          lineNumber: 48,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyValueList, { keyValueObj: requestData?.headers ?? {} }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Query Params" }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
        lineNumber: 52,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Body" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
          lineNumber: 56,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: String(currentRequestBody) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
          lineNumber: 57,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Request.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this);
  }
}
const trafficService$2 = getServiceSync(EService.ITrafficService);
class Response extends React.PureComponent {
  state = {
    selectRecordId: -1,
    currentRequestBody: "",
    currentResponseBody: ""
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$2.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  render() {
    const { selectRecordId, currentResponseBody } = this.state;
    const currentSelectRecord = trafficService$2.getRecordMap()[selectRecordId];
    if (!currentSelectRecord) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
        lineNumber: 42,
        columnNumber: 14
      }, this);
    }
    const response = currentSelectRecord.response;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Header" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
          lineNumber: 48,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyValueList, { keyValueObj: response?.headers ?? {} }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Body" }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
          lineNumber: 52,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: String(currentResponseBody) }, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
          lineNumber: 53,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/Response.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this);
  }
}
const trafficService$1 = getServiceSync(EService.ITrafficService);
class RecordDetail extends React.PureComponent {
  state = {
    selectRecordId: -1,
    currentRequestBody: "",
    currentResponseBody: ""
  };
  unTraffic;
  componentDidMount() {
    this.unTraffic = trafficService$1.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody
      });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }
  getItems() {
    return [
      {
        key: "1",
        label: "原始请求",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Origin, {}, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/RecordDetail.tsx",
          lineNumber: 48,
          columnNumber: 19
        }, this)
      },
      {
        key: "2",
        label: "Request",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Request, {}, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/RecordDetail.tsx",
          lineNumber: 53,
          columnNumber: 19
        }, this)
      },
      {
        key: "3",
        label: "Response",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Response, {}, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/RecordDetail.tsx",
          lineNumber: 58,
          columnNumber: 19
        }, this)
      },
      {
        key: "4",
        label: "Timeline",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Timeline, {}, void 0, false, {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/RecordDetail.tsx",
          lineNumber: 63,
          columnNumber: 19
        }, this)
      }
    ];
  }
  render() {
    const items = this.getItems();
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { className: "record-detail", items }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/views/record-detail/RecordDetail.tsx",
      lineNumber: 69,
      columnNumber: 12
    }, this);
  }
}
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { style: { height: "100vh" }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Header, { style: { padding: 0, background: colorBgContainer }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TopBar, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
      lineNumber: 20,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
      lineNumber: 19,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Content, { style: { margin: "0 16px" }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "monitor-body", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RecordList, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
        lineNumber: 24,
        columnNumber: 13
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RecordDetail, {}, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
        lineNumber: 25,
        columnNumber: 13
      }, void 0)
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
      lineNumber: 23,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
      lineNumber: 22,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Footer, { style: { textAlign: "center" }, children: [
      "Http Trick ©",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Created by tsxuehu"
    ] }, void 0, true, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
    lineNumber: 18,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/App.tsx",
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
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
      selectRecordId: -1,
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
  async setSelectRecordId(id) {
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
  setRightClickedRecordId(id) {
    this.setState({
      rightClickedRecordId: id
    });
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
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(reactExports.StrictMode, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(App, {}, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/main.tsx",
      lineNumber: 20,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/monitor/main.tsx",
      lineNumber: 19,
      columnNumber: 5
    }, this)
  );
  await workbenchService.start({});
}
init();
//# sourceMappingURL=monitor.js.map
