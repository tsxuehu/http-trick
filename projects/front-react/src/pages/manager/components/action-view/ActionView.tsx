import React from 'react';
import { IAction } from '../../service-api/IRuleService.ts';
import { IDataFileEntry } from '../../service-api/IDataFileService.ts';
import find from 'lodash/find';

interface IProps {
  action: IAction;
  mockDataList: IDataFileEntry[];
}

interface IState {}

const modifyResponseType = [
  { value: 'addTimestampToJsCss', label: '将html中的js、css请求加上时间戳' },
  { value: 'returnDataInJsonpStyle', label: '以JSONP的方式返回数据' },
  { value: 'allowCros', label: '增加跨域头部' },
  { value: 'return404', label: '返回404' },
];

export default class ActionView extends React.PureComponent<IProps, IState> {
  modifyResponseDescription() {
    const { action } = this.props;
    if (action.type == 'modifyResponse') {
      const finded = find(modifyResponseType, (entry) => {
        return entry.value == action.data.modifyResponseType;
      });
      if (!finded) return '未知类型';
      if (finded.value != 'returnDataInJsonpStyle') {
        return finded.label;
      }
      return finded.label + '( callback参数名: ' + action.data.callbackName + ' )';
    }
    return '';
  }

  render() {
    const { action, mockDataList } = this.props;
    return (
      <div className="action-value-container">
        {action.type == 'redirect' && (
          <div className="value-redirect row">
            <span className="name">转发</span>
            <span className="value">{action.data.target}</span>
          </div>
        )}
        {action.type == 'mockData' && (
          <div className="value-mock-data row">
            <span className="name">返回mock数据</span>
            <span className="value">{mockDataList.find((item) => item.id == action.data.dataId)?.name}</span>
          </div>
        )}
        {action.type == 'addRequestCookie' && (
          <div className="value-key-value row">
            <span className="name">设置请求Cookie</span>
            <span className="value">
              {action.data.cookieKey}:{action.data.cookieValue}
            </span>
          </div>
        )}
        {action.type == 'addRequestHeader' && (
          <div className="value-key-value row">
            <span className="name">设置请求头</span>
            <span className="value">
              {action.data.reqHeaderKey}:{action.data.reqHeaderValue}
            </span>
          </div>
        )}
        {action.type == 'addQuery' && (
          <div className="value-key-value row">
            <span className="name">增加请求Query</span>
            <span className="value">
              {action.data.queryKey}:{action.data.queryValue}
            </span>
          </div>
        )}
        {action.type == 'addResponseHeader' && (
          <div className="value-key-value row">
            <span className="name">设置响应头</span>
            <span className="value">
              {action.data.resHeaderKey}:{action.data.resHeaderValue}
            </span>
          </div>
        )}
        {action.type == 'modifyResponse' && (
          <div className="value-modify-response row">
            <span className="name">修改响应Body</span>
            <span className="value">{this.modifyResponseDescription()}</span>
          </div>
        )}
        {action.type == 'scriptModifyRequest' && (
          <div className="value-script row">
            <span className="name">Js修改请求内容</span>
            <span className="value">{action.data.modifyRequestScript}</span>
          </div>
        )}
        {action.type == 'scriptModifyResponse' && (
          <div className="value-script row">
            <span className="name">Js修改响应内容</span>
            <span className="value">{action.data.modifyResponseScript}</span>
          </div>
        )}
      </div>
    );
  }
}
