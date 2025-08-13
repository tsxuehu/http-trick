import React from 'react';
// @ts-ignore
import './edit-rule.less';
import IRuleService, { EAction, IAction, IRule, IRuleFile } from '../../service-api/IRuleService.ts';
import { Button, Checkbox, Col, message, Popconfirm, Row, Table } from 'antd';
import { getDefaultAction, getDefaultRule } from '../../service-api/utils/rule.ts';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import EService from '../../config/EService.ts';
import { openDialog } from '../../forms/utils.ts';
import RuleEditForm, { IProps as IRuleEditFormProps } from '../../forms/rule-edit-form/RuleEditForm.tsx';
import { ColumnsType } from 'antd/es/table';
import IDataFileService, { IDataFileEntry } from '../../service-api/IDataFileService.ts';
import ActionView from '../../components/action-view/ActionView.tsx';
import { getQueryParams } from '../../../../common/query-string.ts';

interface IProps {}

interface IState {
  mockDataList: IDataFileEntry[];
  ruleFileId: string;
  loaded: boolean;
  ruleFile?: IRuleFile;
}

const ruleService = getServiceSync<IRuleService>(EService.IRuleService);
const mockDataService = getServiceSync<IDataFileService>(EService.IDataFileService);

export default class EditRule extends React.PureComponent<IProps, IState> {
  state: IState = {
    ruleFileId: '',
    loaded: false,
    mockDataList: [],
  };

  unRule?: () => void;
  unMockData?: () => void;

  componentDidMount() {
    this.loadRuleFile();
    this.unMockData = mockDataService.subscribe(() => {
      this.setState({ mockDataList: mockDataService.getDataFileEntryList() });
    });
  }
  async loadRuleFile() {
    const query = getQueryParams();
    const id = query.id;
    const content = await ruleService.getFileContent(id);
    if (!content) {
      return;
    }
    this.setState({
      ruleFileId: id,
      loaded: true,
      ruleFile: content,
    });
  }
  componentWillUnmount() {
    this.unRule?.();
    this.unMockData?.();
  }
  async addRule() {
    const rule = getDefaultRule();
    const action = getDefaultAction();
    action.type = EAction.redirect;
    rule.actionList.push(action);
    const nextFilter = await openDialog<IRuleEditFormProps, IRule>(RuleEditForm, {
      isEditRule: false,
      isFilterRule: true,
      rule,
    });
    if (!nextFilter) {
      return;
    }
    const { ruleFileId } = this.state;
    await ruleService.saveRule(ruleFileId, nextFilter);
    message.success('保存成功!');
    this.loadRuleFile();
  }
  async toggleRuleCheckState(rule: IRule) {
    const { ruleFileId } = this.state;
    await ruleService.setRuleCheckedState(ruleFileId, rule.id, !rule.checked);
    message.success('设置成功!');
    this.loadRuleFile();
  }
  async deleteRule(rule: IRule, index: number) {
    const { ruleFileId } = this.state;
    await ruleService.removeRule(ruleFileId, rule.id);
    message.success('删除成功!');
    this.loadRuleFile();
  }
  async editRule(rule: IRule, index: number) {
    const nextFilter = await openDialog<IRuleEditFormProps, IRule>(RuleEditForm, {
      isEditRule: true,
      isFilterRule: true,
      rule,
    });
    if (!nextFilter) {
      return;
    }
    const { ruleFileId } = this.state;
    await ruleService.saveRule(ruleFileId, nextFilter);
    message.success('保存成功!');
    this.loadRuleFile();
  }
  async duplicateRule(rule: IRule, index: number) {
    const newRule = JSON.parse(JSON.stringify(rule));
    newRule.id = '';
    const { ruleFileId } = this.state;
    await ruleService.saveRuleFile(ruleFileId, newRule);
    message.success('复制成功!');
    this.loadRuleFile();
  }
  getColumns(): ColumnsType<IRule> {
    const { mockDataList } = this.state;
    return [
      {
        title: '启用',
        dataIndex: 'checked',
        key: 'checked',
        render: (value: boolean, rule: IRule, index: number) => (
          <Checkbox checked={value} onChange={(e) => this.toggleRuleCheckState(rule)}></Checkbox>
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
          ));
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
          );
        },
      },
    ];
  }
  render() {
    const { ruleFile, loaded } = this.state;
    const ruleList = ruleFile?.ruleList || [];
    const columns = this.getColumns();
    return (
      <div>
        <div className="main-content__title">编辑规则集{loaded ? ': ' + ruleFile?.name : ''}</div>
        <div className="project-path-info">
          可以控制单个规则是否启用，当规则所在规则集没有启用时，规则不管是否启用，都不会生效。
        </div>
        <Row>
          <Col span={6} offset={16}>
            <Button type="primary" onClick={() => this.addRule()}>
              新增过滤器
            </Button>
          </Col>
        </Row>
        <Table rowKey="id" dataSource={ruleList} columns={columns} />
      </div>
    );
  }
}
