import React from "react";
import { getServiceSync } from "@spring4js/container-browser/lib/esm/global-fn";
import IProfileService, { IUserProfile } from "../../service-api/IProfileService";
import EService from "../../config/EService.ts";
import { Table, Button, Input, Popconfirm, message } from "antd";
// @ts-ignore
import './path-variable.less'

const profileService = getServiceSync<IProfileService>(EService.IProfileService);


interface IProps {
}

interface IState {
  redirectPathVariableArray: IKeyValuePair [];
}

interface IKeyValuePair {
  key: string;
  value: string;
}

export default class RedirectPathVariable extends React.PureComponent<IProps, IState> {
  state: IState = {
    redirectPathVariableArray: []
  };


  componentDidMount() {
    profileService.subscribe((userProfile: IUserProfile) => {
      const pairs: IKeyValuePair[] = [];
      for (const [key, value] of Object.entries(userProfile.redirectPathVariables)) {
        pairs.push({
          key, value
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

  deleteParam(index: number) {
    const origin = this.state.redirectPathVariableArray;
    origin.splice(index, 1);
    this.setState({ redirectPathVariableArray: [...origin] });
  }

  async saveFile() {
    let redirectPathVariableMap: Record<string, string> = {};
    const origin = this.state.redirectPathVariableArray;
    for (const { key, value } of origin) {
      redirectPathVariableMap[key] = value;
    }
    try {
      await profileService.saveRedirectPathVariables(redirectPathVariableMap)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  setKey(index: number, key: string) {
    const origin = this.state.redirectPathVariableArray;
    origin[index].key = key;
    this.setState({ redirectPathVariableArray: [...origin] });
  }

  setValue(index: number, value: string) {
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
        render: (value: string, record: IKeyValuePair, index: number) => (
          <Input value={value} onChange={(e) => this.setKey(index, e.target.value)} placeholder="工程名" />
        )
      },
      {
        title: "变量值",
        dataIndex: "value",
        key: "value",
        render: (value: string, record: IKeyValuePair, index: number) => (
          <Input value={value} onChange={(e) => this.setValue(index, e.target.value)}
                 placeholder="工程在本地的绝对路径" />
        )
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: IKeyValuePair, index: number) => (
          <Popconfirm title="确认"
                      description="确认删除?"
                      onConfirm={() => this.deleteParam(index)}
                      okText="确认"
                      cancelText="取消">
            <Button type="link">删除</Button>
          </Popconfirm>
        )
      }
    ];
  }

  render() {
    const { redirectPathVariableArray } = this.state;
    const columns = this.getColumns();
    return (
      <div className="project-wraper">
        <div className="main-content__title">转发路径变量管理</div>
        <div
          className="project-path-info">配置http转发规则时，转发路径可以引用这里的变量。例如：将http请求转发到{"${helloworld}"}/dist/hello.js，{"${helloworld}"}会被替换为变量helloworld对应的值。
        </div>
        <Table rowKey="key" dataSource={redirectPathVariableArray} columns={columns} />
        <div style={{ marginTop: "50px", textAlign: "right" }}>
          <Button onClick={() => this.addParam()}>增加工程路径设置</Button>
          <Button type="primary" onClick={() => this.saveFile()}>保存</Button>
        </div>
      </div>
    );
  }
}
