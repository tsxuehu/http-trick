import React from 'react'
import { IAction } from '../../service-api/IRuleService.ts'
import { IMockFile } from '../../service-api/IMockFileService.ts'
import find from 'lodash/find'
// @ts-ignore
import './index.less'
import If from '../logic/If.tsx'
import { Button, Input, Select } from 'antd'

interface IProps {
  action: IAction
  allowRedirectToLocal: boolean
  mockDataList: IMockFile[]
  onChange: (path: string, value: string) => void
}

interface IState {}

const ModifyResponseTypeOptions = [
  { value: 'addTimestampToJsCss', label: '将html中的js、css请求加上时间戳' },
  { value: 'returnDataInJsonpStyle', label: '以JSONP的方式返回数据' },
  { value: 'allowCros', label: '增加跨域头部' },
  { value: 'return404', label: '返回404' },
]

export default class ActionValue extends React.PureComponent<IProps, IState> {
  doTestRule(index: number) {
    // TODO
  }

  createNewDataFile() {
    // TODO
  }

  editDataFile(datafile: IMockFile) {
    // TODO
  }

  render() {
    const { action, mockDataList, onChange, allowRedirectToLocal } = this.props
    const mockDataOptions = mockDataList.map<{ value: string; label: string }>((item) => {
      return { value: item.id, label: item.name }
    })
    let datafileEntry: IMockFile | undefined = undefined
    if (action.type == 'mockData') {
      const finded = find(mockDataList, (entry) => {
        return entry.id == action.data.dataId
      })
      if (finded) {
        datafileEntry = finded
      }
    }
    return (
      <div className="action-value-container">
        <If
          condition={action.type == 'redirect'}
          renderer={
            <div className="value-redirect row">
              <Input
                value={action.data.target}
                onChange={(e) => onChange('target', e.target.value)}
                size="small"
                placeholder={
                  allowRedirectToLocal
                    ? '填写转发路径(远程地址、或者本地地址。远程地址需要以http/https开头)'
                    : '填写转发路径(必须以http/https开头)'
                }
              />
              <Button type="link" size="small" onClick={() => this.doTestRule(-1)}>
                测试
              </Button>
            </div>
          }
        />
        <If
          condition={action.type == 'mockData'}
          renderer={
            <div className="value-mock-data">
              <Select
                value={datafileEntry?.id || ''}
                style={{ width: 120 }}
                placeholder="请选择要返回的数据"
                onChange={(value) => onChange('dataId', value)}
                options={mockDataOptions}
              />
              {datafileEntry && (
                <Button type="link" onClick={() => this.editDataFile(datafileEntry)}>
                  编辑数据
                </Button>
              )}
              <Button type="link" onClick={() => this.createNewDataFile()}>
                增加自定义数据
              </Button>
            </div>
          }
        />

        <If
          condition={action.type == 'addRequestCookie'}
          renderer={
            <div className="value-key-value">
              <div className="row">
                <span className="label">Cookie Key</span>
                <Input
                  value={action.data.cookieKey}
                  onChange={(e) => onChange('cookieKey', e.target.value)}
                  size="small"
                  placeholder="cookie key"
                />
              </div>
              <div className="row row-last">
                <span className="label">Cookie Value</span>
                <Input
                  value={action.data.cookieValue}
                  onChange={(e) => onChange('cookieValue', e.target.value)}
                  size="small"
                  placeholder="cookie value"
                />
              </div>
            </div>
          }
        />
        <If
          condition={action.type == 'addRequestHeader'}
          renderer={
            <div className="value-key-value">
              <div className="row">
                <span className="label">Header Key</span>
                <Input
                  value={action.data.reqHeaderKey}
                  onChange={(e) => onChange('reqHeaderKey', e.target.value)}
                  size="small"
                  placeholder="header key"
                />
              </div>
              <div className="row">
                <span className="label">Header Value</span>
                <Input
                  value={action.data.reqHeaderValue}
                  onChange={(e) => onChange('reqHeaderValue', e.target.value)}
                  size="small"
                  placeholder="header value"
                />
              </div>
            </div>
          }
        />
        <If
          condition={action.type == 'addQuery'}
          renderer={
            <div className="value-key-value">
              <div className="row">
                <span className="label">Query Key</span>
                <Input
                  value={action.data.queryKey}
                  onChange={(e) => onChange('queryKey', e.target.value)}
                  size="small"
                  placeholder="query key"
                />
              </div>
              <div className="row">
                <span className="label">Query value</span>
                <Input
                  value={action.data.queryValue}
                  onChange={(e) => onChange('queryValue', e.target.value)}
                  size="small"
                  placeholder="query value"
                />
              </div>
            </div>
          }
        />
        <If
          condition={action.type == 'addResponseHeader'}
          renderer={
            <div className="value-key-value">
              <div className="row">
                <span className="label">Header Key</span>
                <Input
                  value={action.data.resHeaderKey}
                  onChange={(e) => onChange('resHeaderKey', e.target.value)}
                  size="small"
                  placeholder="header key"
                />
              </div>
              <div className="row">
                <span className="label">Header value</span>
                <Input
                  value={action.data.resHeaderValue}
                  onChange={(e) => onChange('resHeaderValue', e.target.value)}
                  size="small"
                  placeholder="header value"
                />
              </div>
            </div>
          }
        />
        <If
          condition={action.type == 'modifyResponse'}
          renderer={
            <div className="value-modify-response">
              <div className="action-data">
                <span v-if="action.data.modifyResponseType == 'returnDataInJsonpStyle'">
                  <Select
                    value={action.data.modifyResponseType}
                    style={{ width: 120 }}
                    size="small"
                    placeholder="请选择修改返回body操作"
                    onChange={(value) => onChange('modifyResponseType', value)}
                    options={ModifyResponseTypeOptions}
                  />
                  {action.data.modifyResponseType == 'returnDataInJsonpStyle' && (
                    <Input
                      value={action.data.callbackName}
                      onChange={(e) => onChange('callbackName', e.target.value)}
                      size="small"
                      placeholder="jsonp callback参数名"
                    />
                  )}
                </span>
              </div>
            </div>
          }
        />
        <If
          condition={action.type == 'scriptModifyRequest'}
          renderer={
            <div className="value-script">
              <Input.TextArea
                autoSize={{ minRows: 10, maxRows: 10 }}
                value={action.data.modifyRequestScript}
                onChange={(e) => onChange('modifyRequestScript', e.target.value)}
              />
            </div>
          }
        />
        <If
          condition={action.type == 'scriptModifyResponse'}
          renderer={
            <div className="value-script">
              <Input.TextArea
                autoSize={{ minRows: 10, maxRows: 10 }}
                value={action.data.modifyResponseScript}
                onChange={(e) => onChange('modifyResponseScript', e.target.value)}
              />
            </div>
          }
        />
      </div>
    )
  }
}
