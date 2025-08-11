import React from 'react'
import { Button, Input, Popconfirm, Table, Row, Col, Checkbox, CheckboxProps, message } from 'antd'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import EService from '../../config/EService.ts'
import IFilterService from '../../service-api/IFilterService.ts'
import { IAction, IRule } from '../../service-api/IRuleService.ts'
import IProfileService from '../../service-api/IProfileService.ts'
import IMockFileService, { IMockFile } from '../../service-api/IMockFileService.ts'
import ActionView from '../../components/action-view/ActionView.tsx'
import { openDialog } from '../../forms/utils.ts'
import RuleEditForm, { IProps as IRuleEditFormProps } from '../../forms/rule-edit-form/RuleEditForm.tsx'
import { getDefaultAction, getDefaultRule } from '../../service-api/utils/rule.ts'

interface IProps {}

interface IState {
  filters: IRule[]
  enableFilter: boolean
  mockDataList: IMockFile[]
}

const filterService = getServiceSync<IFilterService>(EService.IFilterService)
const profileService = getServiceSync<IProfileService>(EService.IProfileService)
const mockDataService = getServiceSync<IMockFileService>(EService.IMockDataService)

export default class FilterList extends React.PureComponent<IProps, IState> {
  state: IState = {
    filters: [],
    enableFilter: true,
    mockDataList: [],
  }

  unFilter?: () => void
  unProfile?: () => void
  unMockData?: () => void

  componentDidMount() {
    this.unFilter = filterService.subscribe(() => {
      this.setState({ filters: filterService.getFilters() })
    })
    this.unProfile = profileService.subscribe(() => {
      this.setState({ enableFilter: profileService.getProfile().enableFilter })
    })
    this.unMockData = mockDataService.subscribe(() => {
      this.setState({ mockDataList: mockDataService.getMockFileList() })
    })
  }

  componentWillUnmount() {
    this.unFilter?.()
    this.unProfile?.()
    this.unMockData?.()
  }

  async addFilter() {
    const rule = getDefaultRule()
    const action = getDefaultAction()
    action.type = 'addRequestHeader'
    rule.actionList.push(action)
    const nextFilter = await openDialog<IRuleEditFormProps, IRule>(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule,
    })
    if (!nextFilter) {
      return
    }
    try {
      await filterService.saveFilter(nextFilter)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  async duplicateRule(rule: IRule, index: number) {
    const newRule = JSON.parse(JSON.stringify(rule))
    newRule.id = ''

    try {
      await filterService.saveFilter(newRule)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  async editRule(rule: IRule, index: number) {
    const nextFilter = await openDialog<IRuleEditFormProps, IRule>(RuleEditForm, {
      isEditRule: true,
      isFilterRule: true,
      rule,
    })
    if (!nextFilter) {
      return
    }
    try {
      await filterService.saveFilter(nextFilter)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  async toggleRuleCheckState(rule: IRule) {
    try {
      await filterService.setFilterCheckedState(rule.id, !rule.checked)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  async deleteRule(rule: IRule, index: number) {
    try {
      await filterService.removeFilter(rule.id)
      message.success('保存成功!')
    } catch (err: any) {
      message.error(`出错了，${err.message}`)
    }
  }

  getColumns() {
    const { mockDataList, enableFilter } = this.state
    return [
      {
        title: '启用',
        dataIndex: 'checked',
        key: 'checked',
        render: (value: boolean, rule: IRule, index: number) => (
          <Checkbox value={value} disabled={!enableFilter} onChange={(e) => this.toggleRuleCheckState(rule)}>
            Checkbox
          </Checkbox>
        ),
      },
      {
        title: '规则名',
        dataIndex: 'name',
        key: 'name',
        render: (value: string, rule: IRule, index: number) => <span>{value}</span>,
      },
      {
        title: '匹配方法',
        dataIndex: 'method',
        key: 'method',
        render: (value: string, rule: IRule, index: number) => <span>{value ? value : '全部'}</span>,
      },
      {
        title: '匹配路径',
        dataIndex: 'match',
        key: 'match',
        render: (value: string, rule: IRule, index: number) => <span>{value}</span>,
      },
      {
        title: '执行动作',
        dataIndex: 'actionList',
        key: 'actionList',
        render: (actionList: IAction[], rule: IRule, index: number) => {
          return actionList.map((action: IAction, index: number) => (
            <ActionView key={index} action={action} mockDataList={mockDataList}></ActionView>
          ))
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, rule: IRule, index: number) => {
          return (
            <>
              <Popconfirm
                title="确认"
                description="确认删除?"
                onConfirm={() => this.deleteRule(rule, index)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={() => this.duplicateRule(rule, index)}>
                复制
              </Button>
              <Button type="primary" onClick={() => this.editRule(rule, index)}>
                编辑
              </Button>
            </>
          )
        },
      },
    ]
  }

  render() {
    const { filters } = this.state
    console.log(this.state)
    const columns = this.getColumns()
    return (
      <div>
        <div className="main-content__title">过滤器</div>
        <div className="project-path-info">
          一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用
        </div>
        <Row>
          <Col span={6} offset={16}>
            <Button type="primary" onClick={() => this.addFilter()}>
              新增过滤器
            </Button>
          </Col>
        </Row>
        <Table rowKey="id" dataSource={filters} columns={columns} />
      </div>
    )
  }
}
