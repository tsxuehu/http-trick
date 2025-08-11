import React from 'react'
import { Button, Checkbox, Input, Modal, Select, Table } from 'antd'
import { IBaseProps } from '../utils.ts'
import { IAction, IRule } from '../../service-api/IRuleService.ts'
import set from 'lodash/set'
// @ts-ignore
import './index.less'
import { produce } from 'immer'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import IMockFileService, { IMockFile } from '../../service-api/IMockFileService.ts'
import EService from '../../config/EService.ts'
import IUserService from '../../service-api/IUserService.ts'
import ActionValue from '../../components/action-value/ActionValue.tsx'
import { ColumnsType } from 'antd/es/table'

export interface IProps extends IBaseProps {
  isEditRule: boolean
  isFilterRule: boolean
  rule: IRule
}

interface IState {
  rule: IRule
  mockDataList: IMockFile[]
}

const MethodList = [
  { value: '', label: '所有' },
  { value: 'get', label: 'GET' },
  { value: 'post', label: 'POST' },
  { value: 'put', label: 'PUT' },
  { value: 'patch', label: 'PATCH' },
  { value: 'delete', label: 'DELETE' },
  { value: 'options', label: 'OPTIONS' },
]
const ActionTypeList_Filter = [
  //  {value: 'redirect', label: '转发请求'},
  //  {value: 'mockData', label: '返回自定义数据'},
  { value: 'addQuery', label: '增加Query' },
  { value: 'addRequestCookie', label: '设置请求cookie' },
  { value: 'addRequestHeader', label: '增加请求头' },
  { value: 'addResponseHeader', label: '增加响应头' },
  //  {value: 'modifyResponse', label: '修改响应内容'},
  { value: 'scriptModifyRequest', label: 'js修改请求内容' },
  { value: 'scriptModifyResponse', label: 'js修改响应内容' },
]
const ActionTypeList_Rule = [
  { value: 'redirect', label: '转发请求' },
  { value: 'mockData', label: '返回自定义数据' },
  { value: 'addQuery', label: '增加Query' },
  { value: 'addRequestCookie', label: '设置请求cookie' },
  { value: 'addRequestHeader', label: '增加请求头' },
  { value: 'addResponseHeader', label: '增加响应头' },
  { value: 'modifyResponse', label: '修改响应内容' },
  { value: 'scriptModifyRequest', label: 'js修改请求内容' },
  { value: 'scriptModifyResponse', label: 'js修改响应内容' },
]

const mockDataService = getServiceSync<IMockFileService>(EService.IMockDataService)
const userService = getServiceSync<IUserService>(EService.IUserService)

export default class RuleEditForm extends React.PureComponent<IProps, IState> {
  unMockData?: () => void

  constructor(props: IProps) {
    super(props)
    this.state = {
      rule: JSON.parse(JSON.stringify(props.rule)),
      mockDataList: [],
    }
  }

  componentDidMount() {
    this.unMockData = mockDataService.subscribe(() => {
      this.setState({ mockDataList: mockDataService.getMockFileList() })
    })
  }

  componentWillUnmount() {
    this.unMockData?.()
  }

  setValue(path: string, value: any) {
    const nextRule = produce(this.state.rule, (draftRule) => {
      set(draftRule, path, value)
    })
    this.setState({ rule: nextRule })
  }

  handleOk() {
    this.props.onOk(this.state.rule)
  }

  addAction() {
    const { isFilterRule } = this.props
    const initialAction = {
      type: isFilterRule ? 'addRequestHeader' : 'redirect', // 转发redirect, // 转发redirect  接口转发api 使用数据文件替换data
      data: {
        target: '', // 转发目标路径
        dataId: '', //返回数据文件的id
        modifyResponseType: '', // 修改响应内容类型
        callbackName: '', // jsonp请求参数名
        cookieKey: '', // 设置到请求里的cookie key
        cookieValue: '', // 设置到请求里的cookie value
        reqHeaderKey: '', // 请求header
        reqHeaderValue: '',
        resHeaderKey: '', // 响应header
        resHeaderValue: '',
        queryKey: '', // 请求query
        queryValue: '',
        modifyRequestScript: '', // 脚本修改请求
        modifyResponseScript: '', // 脚本修改响应
      },
    }
    const nextRule = produce(this.state.rule, (draftRule) => {
      draftRule.actionList.push(initialAction)
    })
    this.setState({ rule: nextRule })
  }

  deleteAction(action: IAction, index: number) {
    const nextRule = produce(this.state.rule, (draftRule) => {
      draftRule.actionList.splice(index, 1)
    })
    this.setState({ rule: nextRule })
  }

  doTestRule(index: number) {
    // TODO 测试
  }

  getColumns(): ColumnsType<IAction> {
    const isRoot = userService.isRoot()
    const { isFilterRule } = this.props
    const { mockDataList } = this.state
    return [
      {
        title: '动作',
        dataIndex: 'type',
        key: 'type',
        render: (value: string, action: IAction, index: number) => (
          <Select
            value={value}
            style={{ width: 120 }}
            onChange={(value) => this.setValue(`actionList[${index}].type`, value)}
            options={isFilterRule ? ActionTypeList_Filter : ActionTypeList_Rule}
          />
        ),
      },
      {
        title: '参数',
        dataIndex: 'data',
        key: 'data',
        render: (data: any, action: IAction, index: number) => {
          return (
            <ActionValue
              action={action}
              allowRedirectToLocal={isRoot}
              mockDataList={mockDataList}
              onChange={(path, value) => this.setValue(`actionList[${index}].data.${path}`, value)}
            />
          )
        },
      },
      {
        title: '执行动作',
        key: 'actionList',
        render: (_: any, action: IAction, index: number) => {
          return (
            <Button type="primary" danger onClick={() => this.deleteAction(action, index)}>
              删除
            </Button>
          )
        },
      },
    ]
  }

  render() {
    const { onCancel, isEditRule } = this.props
    const { rule } = this.state
    const columns = this.getColumns()
    return (
      <Modal
        title={isEditRule ? '编辑规则' : '新建规则'}
        open={true}
        okText={isEditRule ? '保存规则' : '创建规则'}
        onOk={() => this.handleOk()}
        onCancel={onCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" onClick={() => this.addAction()}>
              新增动作
            </Button>
            <OkBtn />
          </>
        )}
      >
        <div className="rule-edit-form">
          <div className="config-row">
            <span className="config-name">规则名:</span>
            <span className="config-value">
              <Input
                value={rule.name}
                onChange={(e) => this.setValue('name', e.target.value)}
                size="small"
                placeholder="方便记忆规则"
              />
            </span>
          </div>
          <div className="config-row">
            <span className="config-name">匹配规则:</span>
            <span className="config-value match-rule">
              <div className="match-method">
                <Select
                  value={rule.method}
                  style={{ width: 120 }}
                  onChange={(value) => this.setValue('method', value)}
                  options={MethodList}
                />
                <span className="tips">不要忘记选择匹配请求方法</span>
              </div>
              <div className="match-reg">
                <Input
                  value={rule.match}
                  size="small"
                  onChange={(e) => this.setValue('match', e.target.value)}
                  placeholder="填写要拦截的url中部分连续的字符串，或者匹配要拦截url的正则表达式"
                />
                <Button type="link" size="small" onClick={() => this.doTestRule(-1)}>
                  测试
                </Button>
              </div>
            </span>
          </div>
          <div className="rule-actions">执行操作</div>
          <div>
            <Table rowKey={(record, index) => index as number} dataSource={rule.actionList} columns={columns} />
          </div>
        </div>
      </Modal>
    )
  }
}
