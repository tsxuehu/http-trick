import React from 'react'
import { Button, Checkbox, Popconfirm, Table } from 'antd'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import IRuleService, { IAction, IRule, IRuleFileSimple } from '../../service-api/IRuleService.ts'
import EService from '../../config/EService.ts'
import IAppInfoService, { IAppInfo } from '../../service-api/IAppInfoService.ts'

// @ts-ignore
import './rule-list.less'
import { ColumnsType } from 'antd/es/table'
import IProfileService from '../../service-api/IProfileService.ts'

interface IProps {}

interface IState {
  ruleFileList: IRuleFileSimple[]
  enableRule: boolean
}

const ruleService = getServiceSync<IRuleService>(EService.IRuleService)
const appInfoService = getServiceSync<IAppInfoService>(EService.IAppInfoService)
const profileService = getServiceSync<IProfileService>(EService.IProfileService)

export default class RuleList extends React.PureComponent<IProps, IState> {
  state: IState = {
    ruleFileList: [],
    enableRule: true,
  }

  unRule?: () => void
  unProfile?: () => void

  componentDidMount() {
    this.unRule = ruleService.subscribe((data) => {
      this.setState({ ruleFileList: data.ruleFileList })
    })

    this.unProfile = profileService.subscribe(() => {
      this.setState({ enableRule: profileService.getProfile().enableRule })
    })
  }

  componentWillUnmount() {
    this.unRule?.()
    this.unProfile?.()
  }

  importRemoteRule() {}

  addRuleCollection() {}

  onDeleteFile(file: IRuleFileSimple, index: number) {}

  onDownloadFile(file: IRuleFileSimple, index: number) {}

  onShareFile(file: IRuleFileSimple, index: number) {}

  onSelectionChange(file: IRuleFileSimple, index: number) {
    // this.setFileCheckStatus({
    //   ruleFileId: ruleFile.id,
    //   check: !ruleFile.checked
    // })
  }

  getColumns(): ColumnsType<IRuleFileSimple> {
    const { enableRule } = this.state
    return [
      {
        title: '操作',
        key: 'action',
        render: (_: any, ruleFile: IRuleFileSimple, index: number) => {
          return (
            <>
              <Popconfirm
                title="确认"
                description="确认删除?"
                onConfirm={() => this.onDeleteFile(ruleFile, index)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={() => this.onDownloadFile(ruleFile, index)}>
                下载
              </Button>
              <Button type="primary" onClick={() => this.onShareFile(ruleFile, index)}>
                分享
              </Button>
            </>
          )
        },
      },
      {
        title: '启用',
        dataIndex: 'checked',
        key: 'checked',
        render: (value: boolean, ruleFile: IRuleFileSimple, index: number) => (
          <Checkbox value={value} disabled={!enableRule} onChange={(e) => this.onSelectionChange(ruleFile, index)}>
            Checkbox
          </Checkbox>
        ),
      },
    ]
  }

  render() {
    const { ruleFileList, appInfo } = this.state
    const columns = this.getColumns()
    return (
      <div>
        <div className="main-content__title">规则集列表</div>
        <div className="project-path-info">http转发规则以规则集的方式组织，可以控制单个规则集是否启用。</div>
        <div className="rule-list-op">
          <div className="op">
            <Button size="small" onClick={() => this.importRemoteRule()}>
              导入远程规则
            </Button>
          </div>
          <div className="op">
            <Button size="small" onClick={() => this.addRuleCollection()}>
              新增规则集
            </Button>
          </div>
        </div>
        <Table rowKey="id" dataSource={ruleFileList} columns={columns} />
      </div>
    )
  }
}
