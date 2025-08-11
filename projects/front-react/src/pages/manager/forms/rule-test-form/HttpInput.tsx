import React, { useState } from 'react'
import { Input, Select } from 'antd'
import { IHttpApiInfo } from '../../service-api/IRuleService.ts'

export interface IProperty {
  id?: string
  value?: Partial<IHttpApiInfo>
  onChange?: (value: IHttpApiInfo) => void
  options: { value: string; label: string }[]
}

const HttpInput: React.FC<IProperty> = (props) => {
  const { id, value = {}, onChange, options } = props
  const [method, setMethod] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const triggerChange = (changedValue: Partial<IHttpApiInfo>) => {
    onChange?.({ method, url, ...value, ...changedValue })
  }
  const onMethodChange = (newMethod: string) => {
    if (!('method' in value)) {
      setMethod(newMethod)
    }
    triggerChange({ method: newMethod })
  }

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    if (!('url' in value)) {
      setUrl(newUrl)
    }
    triggerChange({ url: newUrl })
  }
  return (
    <span id={id}>
      <Select
        value={value?.method || method}
        style={{ width: 80, margin: '0 8px' }}
        onChange={onMethodChange}
        options={options}
      ></Select>
      <Input type="text" value={value?.url || url} onChange={onUrlChange} style={{ width: 100 }} />
    </span>
  )
}
export default HttpInput
