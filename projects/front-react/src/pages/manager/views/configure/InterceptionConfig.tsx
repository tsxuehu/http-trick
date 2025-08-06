import React from "react";
import { FormProps, message } from "antd";
import { Button, Checkbox, Form, Input, Radio } from "antd";
import type { FormRef } from "rc-field-form/lib/interface";
import { IConfigure } from "../../service-api/IConfigureService.ts";
import IProfileService, { IUserProfile } from "../../service-api/IProfileService.ts";
import { getServiceSync } from "@spring4js/container-browser/lib/esm/global-fn";
import EService from "../../config/EService.ts";


const profileService = getServiceSync<IProfileService>(EService.IProfileService);


interface IProps {
}

interface IState {
}

type FieldType = {
  externalProxy: boolean;
  isSocks5Proxy: boolean;
  httpProxyIp: string;
  httpProxyPort: number;
  socks5ProxyIp: string;
  socks5ProxyPort: number;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function getFormDataFromProfile(profile: IUserProfile): FieldType {

  return {
    externalProxy: profile.externalProxy,
    isSocks5Proxy: profile.externalSocks5Proxy,
    httpProxyIp: profile.httpProxyIp,
    httpProxyPort: profile.httpProxyPort,
    socks5ProxyIp: profile.socks5ProxyIp,
    socks5ProxyPort: profile.socks5ProxyPort
  };
}

export default class InterceptionConfig extends React.PureComponent<IProps, IState> {
  formRef = React.createRef<FormRef<FieldType>>();
  formInitialValue: FieldType = getFormDataFromProfile(profileService.getState());
  unProfile?: () => void;

  componentDidMount() {
    this.unProfile = profileService.subscribe(() => {
      const newFormValue = getFormDataFromProfile(profileService.getState());
      this.formRef.current?.setFieldsValue(newFormValue);
    });
  }

  componentWillUnmount() {
    this.unProfile?.();
  }

  onSave = async (values: FieldType) => {
    console.log(values);
  };

  render() {
    return (<Form
      name="configure"
      ref={this.formRef}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={this.formInitialValue}
      onFinish={this.onSave}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="使用外部代理"
        name="externalProxy"
        valuePropName="checked"
      >
        <Checkbox>使用</Checkbox>
      </Form.Item>
      <Form.Item<FieldType>
        label="外部代理类型"
        name="isSocks5Proxy"
        shouldUpdate={() => true}
      >
        {
          ({ getFieldValue }) => {
            debugger
            let externalProxy = this.formRef.current?.getFieldValue("externalProxy");
            return (<Radio.Group
              name="radiogroup"
              options={[
                { value: true, label: "Socks5代理" },
                { value: false, label: "Http代理" }
              ]}
            />);
          }
        }
      </Form.Item>

    </Form>);
  }
}
