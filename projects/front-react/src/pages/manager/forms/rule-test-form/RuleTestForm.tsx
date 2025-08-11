import React from 'react'
import { Form, Input, message, Modal } from 'antd'
import { IBaseProps } from '../utils.ts'

// @ts-ignore
import './index.less'
import type { FormRef } from 'rc-field-form/lib/interface'
import HttpInput from './HttpInput.tsx'
import IRuleService, { IHttpApiInfo } from '../../service-api/IRuleService.ts'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import EService from '../../config/EService.ts'

export interface IProps extends IBaseProps {
  matchMethod: string // 匹配method
  matchUrl: string // 匹配url
  target: string // 转发末班
}

interface IState {}

type FieldType = {
  request: IHttpApiInfo
  match: IHttpApiInfo
  target: string // 转发目标
  matchResult: string // 匹配结果
  redirectResult: string // 转发结果
  message: string
}

const ruleService = getServiceSync<IRuleService>(EService.IRuleService)

export default class RuleTestForm extends React.PureComponent<IProps, IState> {
  formRef = React.createRef<FormRef<FieldType>>()
  initialValue: FieldType
  constructor(props: IProps) {
    super(props)
    this.initialValue = {
      request: {
        method: '',
        url: '',
      },
      match: {
        method: props.matchMethod,
        url: this.props.matchUrl,
      },

      target: props.target, // 转发目标
      matchResult: '', // 匹配结果
      redirectResult: '', // 转发结果
      message: '',
    }
  }
  async testMatchRule() {
    const values = this.formRef.current?.getFieldsValue()!
    try {
      const result = await ruleService.testRule(values.match, values.target, values.request)
      this.formRef.current?.setFieldsValue({
        matchResult: result.matchResult,
        redirectResult: result.redirectResult,
        message: result.message,
      })
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  render() {
    const { onCancel } = this.props
    return (
      <Modal
        title="匹配-转发 测试"
        open={true}
        okText="测试"
        onOk={() => this.testMatchRule()}
        cancelText="取消"
        onCancel={() => onCancel(undefined)}
      >
        <Form
          name="configure"
          ref={this.formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={this.initialValue}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="匹配规则" name="match">
            <HttpInput
              options={[
                { value: '', label: '所有' },
                { value: 'get', label: 'GET' },
                { value: 'post', label: 'POST' },
                { value: 'put', label: 'PUT' },
                { value: 'patch', label: 'PATCH' },
                { value: 'delete', label: 'DELETE' },
                { value: 'options', label: 'OPTIONS' },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType> label="转发路径" name="target">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="请求" name="request">
            <HttpInput
              options={[
                { value: 'get', label: 'GET' },
                { value: 'post', label: 'POST' },
                { value: 'put', label: 'PUT' },
                { value: 'patch', label: 'PATCH' },
                { value: 'delete', label: 'DELETE' },
                { value: 'options', label: 'OPTIONS' },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType> label="匹配结果" name="matchResult">
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldType> label="转发结果" name="redirectResult">
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldType> label="其他信息" name="message">
            <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} disabled />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
