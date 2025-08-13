import React from 'react';
import { Button, Modal } from 'antd';
import { IBaseProps } from '../utils.ts';
import { EContentType, IDataFileEntry } from '../../service-api/IDataFileService.ts';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/min/vs/editor/editor.main.css';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';

export interface IDataEditFormProps extends IBaseProps {
  dataFileEntry: IDataFileEntry;
  content: string;
}

interface IState {}

const ContentTypeLangMap = {
  [EContentType.html]: 'html',
  [EContentType.json]: 'json',
  [EContentType.javascript]: 'javascript',
};
export default class DataEditForm extends React.PureComponent<IDataEditFormProps, IState> {
  editor: monaco.editor.IStandaloneCodeEditor | undefined;

  async handleOk() {
    const { onOk, onCancel, dataFileEntry } = this.props;
    const content = this.editor?.getValue();
    onOk(content);
  }

  componentDidMount() {
    const { dataFileEntry, content } = this.props;
    this.editor = monaco.editor.create(document.getElementById('content-editor-container')!, {
      value: content,
      language: ContentTypeLangMap[dataFileEntry.contenttype] || 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
    });
    setTimeout(() => {
      this.editor?.updateOptions({
        lineNumbers: 'on',
      });
    }, 2000);
  }

  componentWillUnmount() {
    this.editor?.dispose();
    this.editor = undefined;
  }

  render() {
    const { onCancel, dataFileEntry } = this.props;

    return (
      <Modal
        title="编辑Mock数据文件"
        open={true}
        onOk={() => this.handleOk()}
        onCancel={() => onCancel(undefined)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" onClick={() => {}}>
              全屏
            </Button>
            <Button type="primary" onClick={() => {}}>
              格式化
            </Button>
            <OkBtn />
          </>
        )}
      >
        <div>
          编辑数据文件 {dataFileEntry.name} [Content-Type: {dataFileEntry.contenttype}]
        </div>
        <div id="content-editor-container" style={{ height: '305px' }}></div>
        <div>
          Press <strong>F11</strong> when cursor is in the editor to toggle full screen editing. <strong>Esc</strong>{' '}
          can also be used to <i>exit</i> full screen editing.
        </div>
      </Modal>
    );
  }
}
