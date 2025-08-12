import React, { useEffect } from 'react'
import { Form, Input, Modal } from 'antd'
import { IBaseProps } from '../utils.ts'

export interface IField {
  label: string
  key: string
  value: string
  placeholder: string
}

export interface IPromptFormProps extends IBaseProps {
  title: string
  fields: IField[]
  okText?: string
  cancelText?: string
}

interface IState {}

const PromptForm: React.FC<IPromptFormProps> = (props) => {
  const { title = '编辑信息', okText = '确认', cancelText = '取消', fields, onOk, onCancel } = props
  const [form] = Form.useForm()

  useEffect(() => {
    if (fields.length > 0) {
      const initialValues: Record<string, string> = {}
      fields.forEach((field) => {
        initialValues[field.key] = field.value
      })
      form.setFieldsValue(initialValues)
    }
  }, [])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values)
  }
  return (
    <Modal
      title={title}
      okText={okText}
      cancelText={cancelText}
      open={true}
      onOk={() => handleOk()}
      onCancel={() => onCancel(undefined)}
    >
      <Form form={form} layout="vertical" name="custom_prompt_form">
        {fields.map((field) => (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label || field.key}
            rules={[{ required: true, message: `请输入${field.label || field.key}` }]}
          >
            <Input placeholder={field.placeholder || `请输入${field.label || field.key}`} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}
export default PromptForm
