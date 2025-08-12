import { EAction, IAction, IRule } from '../IRuleService.ts';

export function getDefaultRule(): IRule {
  return {
    name: '',
    id: '',
    method: '',
    match: '',
    checked: true,
    actionList: [],
  };
}
export function getDefaultAction(): IAction {
  return {
    type: EAction.redirect, // 转发redirect  接口转发api 使用数据文件替换data
    data: {
      target: '', // 转发目标路径
      dataId: '', //返回数据文件的id
      modifyResponseType: '', // 修改响应内容类型
      callbackName: '', // jsonp请求参数名
      cookieKey: '', // 设置到请求里的cookie key
      cookieValue: '', // 设置到请求里的cookie value
      reqHeaderKey: '', // 请求header
      reqHeaderValue: '',
      resHeaderKey: '', // 响应header
      resHeaderValue: '',
      queryKey: '', // 请求query
      queryValue: '',
      modifyRequestScript: '', // 脚本修改请求
      modifyResponseScript: '', // 脚本修改响应
    },
  };
}
