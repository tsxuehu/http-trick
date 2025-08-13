import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import IRuleService from '../../service-api/IRuleService.ts';
import EService from '../../config/EService.ts';
interface IProps {}

interface IState {}

type FieldType = {
  name: string;
  description: string;
};
const ruleService = getServiceSync<IRuleService>(EService.IRuleService);

const CreateRule: React.FC<IProps> = () => {
  const navigate = useNavigate();
  const onSave = async (values: FieldType) => {
    try {
      const id = await ruleService.createFile(values.name, values.description);
      navigate(`/editrule?id=${id}`);
      message.success('创建成功!');
    } catch (err: any) {
      message.error(`出错了，${err.message}`);
    }
  };

  return (
    <div>
      <div className="main-content__title">创建规则集</div>
      <Form
        name="创建规则集"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onSave}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="规则集名字"
          name="name"
          rules={[
            { type: 'string', required: true, message: '请输入文件名称名称' },
            { type: 'string', min: 2, max: 20, message: '长度在 2 到 20 个字符' },
          ]}
        >
          <Input placeholder="规则集名字" />
        </Form.Item>
        <Form.Item<FieldType>
          label="规则集描述"
          name="description"
          rules={[{ required: true, message: '请输入文件描述' }]}
        >
          <Input.TextArea autoSize={{ minRows: 10, maxRows: 10 }} placeholder="规则集描述" />
        </Form.Item>
        <Form.Item label={null}>
          <Button size="small" onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default CreateRule;
