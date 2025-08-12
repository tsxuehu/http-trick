import React from 'react';
import { Button, Checkbox, message, Modal, Popconfirm, Table } from 'antd';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import IRuleService, { IAction, IRule, IRuleFileSimple } from '../../service-api/IRuleService.ts';
import EService from '../../config/EService.ts';
import IAppInfoService, { IAppInfo } from '../../service-api/IAppInfoService.ts';
import copyToClipboard from 'copy-to-clipboard';
// @ts-ignore
import './rule-list.less';
import { ColumnsType } from 'antd/es/table';
import IProfileService from '../../service-api/IProfileService.ts';
import { NavLink } from 'react-router';
import { openDialog } from '../../forms/utils.ts';
import PromptForm, { IPromptFormProps } from '../../forms/prompt/PromptForm.tsx';
import { getRemoteFile } from '../../../../api/utils.ts';

interface IProps {}

interface IState {
  ruleFileList: IRuleFileSimple[];
  enableRule: boolean;
}

const ruleService = getServiceSync<IRuleService>(EService.IRuleService);
const appInfoService = getServiceSync<IAppInfoService>(EService.IAppInfoService);
const profileService = getServiceSync<IProfileService>(EService.IProfileService);

export default class RuleList extends React.PureComponent<IProps, IState> {
  state: IState = {
    ruleFileList: [],
    enableRule: true,
  };

  unRule?: () => void;
  unProfile?: () => void;

  componentDidMount() {
    this.unRule = ruleService.subscribe((data) => {
      this.setState({ ruleFileList: data.ruleFileList });
    });

    this.unProfile = profileService.subscribe(() => {
      this.setState({ enableRule: profileService.getProfile().enableRule });
    });
  }

  componentWillUnmount() {
    this.unRule?.();
    this.unProfile?.();
  }

  async importRemoteRule() {
    const values = await openDialog<IPromptFormProps, any>(PromptForm, {
      title: '导入远程规则',
      fields: [
        { label: '请输入远程规则文件的url', key: 'url', value: '', placeholder: '' },
        { label: '请输入导入规则的文件名', key: 'name', value: '', placeholder: '' },
      ],
    });
    if (!values) {
      return;
    }
    const content = await getRemoteFile(values.url);
    content.meta = {
      remote: true,
      url: values.url,
    };
    content.id = '';

    content.name = values.name;
    content.checked = false;

    const varNameList = ruleService.getReferenceVar(content);
    let infoStr;
    if (varNameList.length > 0) {
      infoStr = `导入规则文件名为${content.name},引用变量【${varNameList.join(
        '; ',
      )}】请确保变量已经在转发路径变量中设置过`;
    } else {
      infoStr = `导入规则文件名为${content.name}`;
    }
    Modal.confirm({
      title: '导入远程规则',
      content: infoStr,
      onOk: async () => {
        try {
          await ruleService.saveRuleFile(content.id, content);
          message.success('创建成功!');
        } catch (err: any) {
          message.error(`出错了，${err.message}`);
        }
      },
    });
  }

  async onDeleteFile(file: IRuleFileSimple, index: number) {
    try {
      await ruleService.deleteRuleFile(file.id);
      message.success('删除成功!');
    } catch (err: any) {
      message.error(`出错了，${err.message}`);
    }
  }

  onDownloadFile(file: IRuleFileSimple, index: number) {
    if (!file.meta.remote) {
      window.open('/rule/download?id=' + file.id, '_blank');
    } else {
      window.open(file.meta.url, '_blank');
    }
  }

  onShareFile(file: IRuleFileSimple, index: number) {
    const appInfo = appInfoService.getAppInfo();
    let url = `http://${appInfo.pcIp}:${appInfo.webUiPort}/rule/file/raw?id=${encodeURIComponent(file.id)}`;
    copyToClipboard(url);
    message.success(`已复制规则${file.name}链接`);
  }

  async toggleFileCheckStatus(file: IRuleFileSimple, index: number) {
    try {
      await ruleService.setFileCheckStatus(file.id, !file.checked);
    } catch (err: any) {
      message.error(`出错了，${err.message}`);
    }
  }

  getColumns(): ColumnsType<IRuleFileSimple> {
    const { enableRule } = this.state;
    return [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        render: (value: boolean, ruleFile: IRuleFileSimple, index: number) => <>{value}</>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        render: (value: boolean, ruleFile: IRuleFileSimple, index: number) => <>{value}</>,
      },
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
              <NavLink to={`/editrule?id=${ruleFile.id}`}>
                <Button size="small">编辑</Button>
              </NavLink>
            </>
          );
        },
      },
      {
        title: '启用',
        dataIndex: 'checked',
        key: 'checked',
        render: (value: boolean, ruleFile: IRuleFileSimple, index: number) => (
          <Checkbox
            checked={value}
            disabled={!enableRule}
            onChange={(e) => this.toggleFileCheckStatus(ruleFile, index)}
          ></Checkbox>
        ),
      },
    ];
  }

  render() {
    const { ruleFileList } = this.state;
    const columns = this.getColumns();
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
            <NavLink to="/createrulefile">
              <Button size="small">新增规则集</Button>
            </NavLink>
          </div>
        </div>
        <Table rowKey="id" dataSource={ruleFileList} columns={columns} />
      </div>
    );
  }
}
