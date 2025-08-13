import React from 'react';
import './data-list.less';
import { Button, message, Popconfirm, Table } from 'antd';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import IDataFileService, { IDataFileEntry } from '../../service-api/IDataFileService.ts';
import EService from '../../config/EService.ts';
import { ColumnsType } from 'antd/es/table';
import { openDialog } from '../../forms/utils.ts';
import DataCreateForm, { IDataCreateFormProps } from '../../forms/data-create-form/DataCreateForm.tsx';
import DataEditForm, { IDataEditFormProps } from '../../forms/data-edit-form/DataEditForm.tsx';

interface IProps {}

interface IState {
  dataFileList: IDataFileEntry[];
}

const dataFileService = getServiceSync<IDataFileService>(EService.IDataFileService);

export default class DataList extends React.PureComponent<IProps, IState> {
  state: IState = {
    dataFileList: [],
  };
  unMockData?: () => void;

  componentDidMount() {
    this.unMockData = dataFileService.subscribe((data) => {
      this.setState({ dataFileList: data.dataFileList });
    });
  }

  componentWillUnmount() {
    this.unMockData?.();
  }

  async requestAddDataFile() {
    const entry = await openDialog<IDataCreateFormProps, any>(DataCreateForm, {});
    await dataFileService.createDataFileEntry(entry);
    message.success('创建成功!');
  }

  async requestEditDataFile(dataEntry: IDataFileEntry, index: number) {
    const content = await dataFileService.getDataFile(dataEntry.id);
    const newContent = await openDialog<IDataEditFormProps, any>(DataEditForm, {
      dataFileEntry: dataEntry,
      content,
    });
    await dataFileService.saveDataFile(dataEntry.id, newContent);
    message.success('创建成功!');
  }

  async deleteDataFile(dataEntry: IDataFileEntry, index: number) {
    await dataFileService.removeDataFileEntry(dataEntry);
    message.success('删除成功!');
  }

  getColumns(): ColumnsType<IDataFileEntry> {
    return [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        render: (value: string, mockFile: IDataFileEntry, index: number) => <span>{value}</span>,
      },
      {
        title: '类型',
        dataIndex: 'contenttype',
        key: 'contenttype',
        render: (value: string, mockFile: IDataFileEntry, index: number) => <span>{value}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, mockFile: IDataFileEntry, index: number) => {
          return (
            <>
              <Popconfirm
                title="确认"
                description="确认删除?"
                onConfirm={() => this.deleteDataFile(mockFile, index)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={() => this.requestEditDataFile(mockFile, index)}>
                编辑
              </Button>
            </>
          );
        },
      },
    ];
  }

  render() {
    const columns = this.getColumns();
    const { dataFileList } = this.state;
    return (
      <div>
        <div className="main-content__title">自定义数据文件列表</div>
        <div className="project-path-info">在http转发规则里面，可以配置将这里的mock数据返回给浏览器</div>
        <div className="top-op">
          <Button size="small" onClick={() => this.requestAddDataFile()}>
            新增数据文件
          </Button>
        </div>
        <Table rowKey="id" dataSource={dataFileList} columns={columns} />
      </div>
    );
  }
}
