import React from 'react'
import { Modal } from 'antd'
import { IBaseProps } from '../utils.ts'

interface IProps extends IBaseProps {
}

interface IState {
}

export default class DataEditForm extends React.PureComponent<IProps, IState> {
  handleOk() {

  }

  render() {
    const { onCancel } = this.props
    return (
      <Modal
        title="新建Mock数据文件"
        open={true}
        onOk={() => this.handleOk()}
        onCancel={onCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    )
  }
}
