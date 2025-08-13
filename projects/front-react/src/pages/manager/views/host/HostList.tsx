import React from 'react';
import './host-list.less';
import { Button, Checkbox, message, Popconfirm, Radio, Table } from 'antd';
import { NavLink } from 'react-router';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import IHostService, { IHostFileListItem } from '../../service-api/IHostService.ts';
import EService from '../../config/EService.ts';
import IProfileService from '../../service-api/IProfileService.ts';
import IAppInfoService from '../../service-api/IAppInfoService.ts';
import { ColumnsType } from 'antd/es/table';
import copyToClipboard from 'copy-to-clipboard';
import { openDialog } from '../../forms/utils.ts';
import PromptForm, { IPromptFormProps } from '../../forms/prompt/PromptForm.tsx';
import { getRemoteFile } from '../../../../api/utils.ts';
interface IProps {}

interface IState {
  enableHost: boolean;
  hostFileList: IHostFileListItem[];
}
const hostService = getServiceSync<IHostService>(EService.IHostService);
const profileService = getServiceSync<IProfileService>(EService.IProfileService);
const appInfoService = getServiceSync<IAppInfoService>(EService.IAppInfoService);

export default class HostList extends React.PureComponent<IProps, IState> {
  state: IState = {
    hostFileList: [],
    enableHost: true,
  };
  unHost?: () => void;
  unProfile?: () => void;
  componentDidMount() {
    this.unHost = hostService.subscribe((data) => {
      this.setState({ hostFileList: data.hostFileList });
    });

    this.unProfile = profileService.subscribe(() => {
      this.setState({ enableHost: profileService.getProfile().enableHost });
    });
  }

  componentWillUnmount() {
    this.unHost?.();
    this.unProfile?.();
  }

  async importRemoteHostFile() {
    const values = await openDialog<IPromptFormProps, any>(PromptForm, {
      title: '导入远程Host',
      fields: [
        { label: '请输入远程Host文件的url', key: 'url', value: '', placeholder: '' },
        { label: '请输入导入Host的文件名', key: 'name', value: '', placeholder: '' },
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
    await hostService.saveFile('', content);
    message.success('导入成功!');
  }
  async onDeleteFile(file: IHostFileListItem, index: number) {
    await hostService.deleteFile(file.id);
    message.success('删除成功!');
  }
  onShareFile(file: IHostFileListItem, index: number) {
    const appInfo = appInfoService.getAppInfo();
    let url = `http://${appInfo.pcIp}:${appInfo.webUiPort}/host/file/raw?id=${encodeURIComponent(file.id)}`;
    // 复制
    copyToClipboard(url);
    message.success(`已复制Host${file.name}链接`);
  }
  async useFile(file: IHostFileListItem, index: number): Promise<void> {
    await hostService.useFile(file.id);
  }
  getColumns(): ColumnsType<IHostFileListItem> {
    const { enableHost } = this.state;
    return [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        render: (value: boolean, hostFile: IHostFileListItem, index: number) => <>{value}</>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        render: (value: boolean, hostFile: IHostFileListItem, index: number) => <>{value}</>,
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, hostFile: IHostFileListItem, index: number) => {
          return (
            <>
              <Popconfirm
                title="确认"
                description="确认删除?"
                onConfirm={() => this.onDeleteFile(hostFile, index)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={() => this.onShareFile(hostFile, index)}>
                分享
              </Button>
              <NavLink to={`/edithost?id=${hostFile.id}`}>
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
        render: (value: boolean, hostFile: IHostFileListItem, index: number) => (
          <Radio checked={value} disabled={!enableHost} onChange={(e) => this.useFile(hostFile, index)}></Radio>
        ),
      },
    ];
  }
  render() {
    const { hostFileList } = this.state;
    const columns = this.getColumns();
    return (
      <div className="host-view">
        <div className="main-content__title">Host 文件列表</div>
        <div className="project-path-info">只允许一个host文件生效。</div>
        <div className="host-list-op">
          <Button size="small" onClick={() => this.importRemoteHostFile()}>
            导入远程Host
          </Button>
          <NavLink to="/createhostfile">
            <Button size="small">新增 Host 文件</Button>
          </NavLink>
        </div>
        <Table rowKey="id" dataSource={hostFileList} columns={columns} />
      </div>
    );
  }
}
