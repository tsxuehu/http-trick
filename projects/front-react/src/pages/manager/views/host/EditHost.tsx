import React from 'react';
import './edit-host.less';
import IHostService, { IHostFile } from '../../service-api/IHostService.ts';
import { Button, Col, Input, Row } from 'antd';
import { getQueryParams } from '../../../../common/query-string.ts';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import EService from '../../config/EService.ts';
import { produce } from 'immer';
interface IProps {}

interface IState {
  hostFileId: string;
  loaded: boolean;
  hostFile?: IHostFile;
}
const PlaceHolder = `#示例
8.8.8.8    www.google.com
4.4.4.4    *.taobao.com #所有后缀为.taobao.com的域名都被解析为4.4.4.4
6.6.6.6    www.youzan.com h5.youzan.com`;

const hostService = getServiceSync<IHostService>(EService.IHostService);

export default class EditHost extends React.PureComponent<IProps, IState> {
  state: IState = {
    hostFileId: '',
    loaded: false,
  };
  async componentDidMount() {
    this.loadHostFile();
  }
  componentWillUnmount() {}
  async loadHostFile() {
    const query = getQueryParams();
    const id = query.id;
    const content = await hostService.getFileContent(id);
    if (!content) {
      return;
    }
    this.setState({
      hostFileId: id,
      loaded: true,
      hostFile: content,
    });
  }

  async saveFile() {
    const { hostFile, hostFileId } = this.state;
    await hostService.saveFile(hostFileId, hostFile!);
  }
  onContentChange(content: string) {
    const { hostFile } = this.state;
    const newHostFile = produce(hostFile, (draft) => {
      draft!.content = content;
    });
    this.setState({
      hostFile: newHostFile,
    });
  }
  render() {
    const { hostFile, loaded } = this.state;
    return (
      <div>
        <div className="main-content__title">编辑Host文件{loaded ? ': ' + hostFile?.name : ''}</div>
        <Row>
          <Col span={6} offset={16}>
            <Button type="primary" onClick={() => this.saveFile()}>
              保存文件
            </Button>
          </Col>
        </Row>

        <Input.TextArea
          value={hostFile?.content}
          autoSize={{ minRows: 20, maxRows: 20 }}
          onChange={(e) => this.onContentChange(e.target.value)}
          placeholder={PlaceHolder}
        />
      </div>
    );
  }
}
