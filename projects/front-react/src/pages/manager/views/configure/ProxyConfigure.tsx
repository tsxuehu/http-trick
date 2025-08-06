import React from "react";
import {FormProps, message} from "antd";
import {Button, Checkbox, Form, Input} from "antd";
import type {FormRef} from "rc-field-form/lib/interface";

import {getServiceSync} from "@spring4js/container-browser/lib/esm/global-fn";
import EService from "../../config/EService.ts";
import IConfigureService, {IConfigure} from "../../service-api/IConfigureService.ts";

const configureService = getServiceSync<IConfigureService>(EService.IConfigureService);


interface IProps {
}

interface IState {
}

type FieldType = {
    startHttpProxy: boolean
    startSocks5: boolean
    startDns: boolean
    professionalVersion: boolean
    httpProxyPort: number
    socks5ProxyPort: number
    webUiPort: number
    dnsPort: number
    requestTimeoutTime: number
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

function getFormDataFromProfile(config: IConfigure): FieldType {

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

export default class ProxyConfigure extends React.PureComponent<IProps, IState> {
    formRef = React.createRef<FormRef<FieldType>>();
    formInitialValue: FieldType = getFormDataFromProfile(configureService.getState())
    unConfig?: () => void

    componentDidMount() {
        this.unConfig = configureService.subscribe(() => {
            const newFormValue = getFormDataFromProfile(configureService.getState());
            this.formRef.current?.setFieldsValue(newFormValue);
        });
    }

    componentWillUnmount() {
        this.unConfig?.()
    }

    onSave = async (values: FieldType) => {
        try {
            await configureService.save({
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
            message.success("保存成功!");
        } catch (err: any) {
            message.error(`出错了，${err.message}`);
        }
    };

    render() {
        return (<Form
                name="configure"
                ref={this.formRef}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={this.formInitialValue}
                onFinish={this.onSave}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="是否开启Http代理"
                    name="startHttpProxy"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item<FieldType>
                    label="是否开启Socks5代理"
                    name="startSocks5"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item<FieldType>
                    label="是否开启DNS服务"
                    name="startDns"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item<FieldType>
                    label="是否开启专业版"
                    name="professionalVersion"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Http代理端口"
                    name="httpProxyPort"
                    rules={[{required: true, message: "填写http代理端口号"}]}
                >
                    <Input placeholder="http代理端口"/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Socks5端口"
                    name="socks5ProxyPort"
                    rules={[{required: true, message: "填写socks5代理端口"}]}
                >
                    <Input placeholder="socks5代理端口"/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="WebUi端口"
                    name="webUiPort"
                    rules={[{required: true, message: "填写WebUi端口"}]}
                >
                    <Input placeholder="WebUi端口"/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="DNS端口"
                    name="dnsPort"
                    rules={[{required: true, message: "填写DNS端口"}]}
                >
                    <Input placeholder="DNS端口"/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="超时时间"
                    name="requestTimeoutTime"
                    rules={[{required: true, message: "填写超时时间"}]}
                >
                    <Input placeholder="超时时间"/>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
