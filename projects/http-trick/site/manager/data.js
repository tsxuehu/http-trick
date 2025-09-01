import { a2 as Future, T as clientExports, e as React, F as Form, r as reactExports, j as jsxDevRuntimeExports, n as Modal, I as Input, G as axios, a3 as createStore, w as v4 } from "./vendor.js";
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    Modal,
    {
      title,
      okText,
      cancelText,
      open: true,
      onOk: () => handleOk(),
      onCancel: () => onCancel(void 0),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Form, { form, layout: "vertical", name: "custom_prompt_form", children: fields.map((field) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Form.Item,
        {
          name: field.key,
          label: field.label || field.key,
          rules: [{ required: true, message: `请输入${field.label || field.key}` }],
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: field.placeholder || `请输入${field.label || field.key}` }, void 0, false, {
            fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/prompt/PromptForm.tsx",
            lineNumber: 56,
            columnNumber: 13
          }, void 0)
        },
        field.key,
        false,
        {
          fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/prompt/PromptForm.tsx",
          lineNumber: 50,
          columnNumber: 11
        },
        void 0
      )) }, void 0, false, {
        fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/prompt/PromptForm.tsx",
        lineNumber: 48,
        columnNumber: 7
      }, void 0)
    },
    void 0,
    false,
    {
      fileName: "D:/workspace-sz/http-trick/projects/front-react/src/pages/manager/forms/prompt/PromptForm.tsx",
      lineNumber: 40,
      columnNumber: 5
    },
    void 0
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
var EContentType = /* @__PURE__ */ ((EContentType2) => {
  EContentType2["html"] = "text/html";
  EContentType2["json"] = "application/json";
  EContentType2["javascript"] = "application/javascript";
  return EContentType2;
})(EContentType || {});
async function saveFile(content) {
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
async function getUserInfo() {
  const response = await axios.get(`/profile/getUserInfo`);
  assertAxiosRes(response);
  return response.data.data;
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
async function saveDataEntryFromTraffic(reqId, name, contenttype) {
  const response = await axios.post("/data/savedatafromtraffic", {
    id: v4(),
    name,
    contenttype,
    reqid: reqId
  });
  assertAxiosRes(response);
}
export {
  EContentType as E,
  PromptForm as P,
  StateBase as S,
  getUserId as a,
  getDataFile as b,
  createDataFile as c,
  assertAxiosRes as d,
  enableResolveIp as e,
  disableResolveIp as f,
  getRemoteFile as g,
  enableFilter as h,
  disableFilter as i,
  enableHost as j,
  disableHost as k,
  enableRule as l,
  disableRule as m,
  saveFile as n,
  openDialog as o,
  saveDataEntryFromTraffic as p,
  getUserInfo as q,
  removeDataFile as r,
  saveDataFile as s
};
//# sourceMappingURL=data.js.map
