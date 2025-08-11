import React from 'react'
import { FormProps, message } from 'antd'
import { Button, Checkbox, Form, Input, Radio } from 'antd'
import type { FormRef } from 'rc-field-form/lib/interface'
import IProfileService, { IUserProfile } from '../../service-api/IProfileService.ts'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import EService from '../../config/EService.ts'

const profileService = getServiceSync<IProfileService>(EService.IProfileService)

const PlaceHolder = `#示例
all               # 有all 配置项，所有域名君走http解析代理
*.domain.com      # 所有domain域名都会走Http解析代理
www.domain.com    # www.domain.com走Http解析代理`

interface IProps {}

interface IState {}

type FieldType = {
  externalProxy: boolean
  isSocks5Proxy: boolean
  httpProxyIp: string
  httpProxyPort: number
  socks5ProxyIp: string
  socks5ProxyPort: number
  goThroughProxyConfig: string
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

function getFormDataFromProfile(profile: IUserProfile): FieldType {
  return {
    externalProxy: profile.externalProxy,
    isSocks5Proxy: profile.externalSocks5Proxy,
    httpProxyIp: profile.httpProxyIp,
    httpProxyPort: profile.httpProxyPort,
    socks5ProxyIp: profile.socks5ProxyIp,
    socks5ProxyPort: profile.socks5ProxyPort,
    goThroughProxyConfig: profile.goThroughProxyConfig,
  }
}

export default class InterceptionConfig extends React.PureComponent<IProps, IState> {
  formRef = React.createRef<FormRef<FieldType>>()
  formInitialValue: FieldType = getFormDataFromProfile(profileService.getProfile())
  unProfile?: () => void

  componentDidMount() {
    this.unProfile = profileService.subscribe(() => {
      const newFormValue = getFormDataFromProfile(profileService.getProfile())
      this.formRef.current?.setFieldsValue(newFormValue)
    })
  }

  componentWillUnmount() {
    this.unProfile?.()
  }

  onSave = async (values: FieldType) => {
    try {
      await profileService.saveProfile({
        externalProxy: values.externalProxy,
        externalHttpProxy: !values.isSocks5Proxy,
        externalSocks5Proxy: values.isSocks5Proxy,
        httpProxyIp: values.httpProxyIp,
        httpProxyPort: values.httpProxyPort,
        socks5ProxyIp: values.socks5ProxyIp,
        socks5ProxyPort: values.socks5ProxyPort,
        goThroughProxyConfig: values.goThroughProxyConfig,
      })
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  render() {
    return (
      <Form
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
        <Form.Item<FieldType> label="使用外部代理" name="externalProxy" valuePropName="checked">
          <Checkbox>使用</Checkbox>
        </Form.Item>
        <Form.Item<FieldType>
          noStyle
          // name="isSocks5Proxy" 传name属性，函数不会执行
          shouldUpdate={(prevValues, currentValues) => prevValues.externalProxy !== currentValues.externalProxy}
        >
          {(form) => {
            let externalProxy = form.getFieldValue('externalProxy')
            if (!externalProxy) {
              return null
            }
            return (
              <Form.Item<FieldType> label="外部代理类型" name="isSocks5Proxy">
                <Radio.Group
                  options={[
                    { value: true, label: 'Socks5代理' },
                    { value: false, label: 'Http代理' },
                  ]}
                />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item<FieldType>
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.externalProxy !== currentValues.externalProxy ||
            prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy
          }
        >
          {(form) => {
            let externalProxy = form.getFieldValue('externalProxy')
            let isSocks5Proxy = form.getFieldValue('isSocks5Proxy')
            if (!externalProxy || isSocks5Proxy) {
              return null
            }
            return (
              <Form.Item<FieldType> label="Http代理 IP" name="httpProxyIp">
                <Input placeholder="Http代理 IP" />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item<FieldType>
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.externalProxy !== currentValues.externalProxy ||
            prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy
          }
        >
          {(form) => {
            let externalProxy = form.getFieldValue('externalProxy')
            let isSocks5Proxy = form.getFieldValue('isSocks5Proxy')
            if (!externalProxy || isSocks5Proxy) {
              return null
            }
            return (
              <Form.Item<FieldType> label="Http代理 Port" name="httpProxyPort">
                <Input placeholder="Http代理 Port" />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item<FieldType>
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.externalProxy !== currentValues.externalProxy ||
            prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy
          }
        >
          {(form) => {
            let externalProxy = form.getFieldValue('externalProxy')
            let isSocks5Proxy = form.getFieldValue('isSocks5Proxy')
            if (!externalProxy || !isSocks5Proxy) {
              return null
            }
            return (
              <Form.Item<FieldType> label="Socks代理 IP" name="socks5ProxyIp">
                <Input placeholder="Socks代理 IP" />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item<FieldType>
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.externalProxy !== currentValues.externalProxy ||
            prevValues.isSocks5Proxy !== currentValues.isSocks5Proxy
          }
        >
          {(form) => {
            let externalProxy = form.getFieldValue('externalProxy')
            let isSocks5Proxy = form.getFieldValue('isSocks5Proxy')
            if (!externalProxy || !isSocks5Proxy) {
              return null
            }
            return (
              <Form.Item<FieldType> label="Socks代理 Port" name="socks5ProxyPort">
                <Input placeholder="Socks代理 Port" />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item<FieldType> label="需要Http解析代理的域名" name="goThroughProxyConfig">
          <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder={PlaceHolder} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
