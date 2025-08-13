import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { IBaseProps } from '../utils.ts';
import { EContentType } from '../../service-api/IDataFileService.ts';

type FieldType = {
  name: string;
  contenttype: string;
};

export interface IDataCreateFormProps extends IBaseProps {}

interface IState {}

const DataCreateForm: React.FC<IDataCreateFormProps> = (props) => {
  const { onOk, onCancel } = props;
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };
  return (
    <Modal title="新建Mock数据文件" open={true} onOk={() => handleOk()} onCancel={() => onCancel(undefined)}>
      <Form form={form} layout="vertical" name="custom_prompt_form">
        <Form.Item<FieldType> label="名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="名称" name="contenttype">
          <Select
            style={{ width: 80, margin: '0 8px' }}
            options={[
              { value: EContentType.html, label: 'html' },
              { value: EContentType.json, label: 'json' },
              { value: EContentType.javascript, label: 'javascript' },
            ]}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DataCreateForm;
