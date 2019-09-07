<template>
    <el-dialog title="添加页面" :visible.sync="visible">

    </el-dialog>
</template>

<script>
  import RuleDetail from './RuleDetail';

  export default {
    name: "RuleEditorForm",
    components: {
      [RuleDetail.name]: RuleDetail
    },
    data() {
      return {
        visible: false,
        isFilterRule: false,
        rule: {
          name: "",
          key: '',
          method: "",
          match: "",
          checked: true,
          actionList: [{
            type: "redirect",// 转发redirect  接口转发api 使用数据文件替换data
            data: {
              target: "",// 转发目标路径
              dataId: '', //返回数据文件的id
              modifyResponseType: '',// 修改响应内容类型
              callbackName: "", // jsonp请求参数名
              cookieKey: "", // 设置到请求里的cookie key
              cookieValue: "", // 设置到请求里的cookie value
              reqHeaderKey: "", // 请求header
              reqHeaderValue: "",
              resHeaderKey: "", // 响应header
              resHeaderValue: "",
              queryKey: "", // 请求query
              queryValue: "",
              modifyRequestScript: "", // 脚本修改请求
              modifyResponseScript: "" // 脚本修改响应
            }
          }]
        },
      }
    },

    computed: {
      ruleTypes() {
        if (this.isFilterRule) {
          return [
            //  { value: 'redirect', label: '转发请求' },
            //  { value: 'mockData', label: '返回自定义数据' },
            {value: 'addRequestHeader', label: '增加请求头'},
            {value: 'addQuery', label: '增加Query'},
            {value: 'addResponseHeader', label: '增加响应头'},
            //  { value: 'modifyResponse', label: '修改响应内容' },
            {value: 'addRequestCookie', label: '设置请求cookie'},
            {value: 'scriptModifyRequest', label: 'js修改请求内容'},
            {value: 'scriptModifyResponse', label: 'js修改响应内容'}
          ]
        } else {
          return [
            {value: 'redirect', label: '转发请求'},
            {value: 'mockData', label: '返回自定义数据'},
            {value: 'addRequestHeader', label: '增加请求头'},
            {value: 'addQuery', label: '增加Query'},
            {value: 'addResponseHeader', label: '增加响应头'},
            {value: 'modifyResponse', label: '修改响应内容'},
            {value: 'addRequestCookie', label: '设置请求cookie'},
            {value: 'scriptModifyRequest', label: 'js修改请求内容'},
            {value: 'scriptModifyResponse', label: 'js修改响应内容'}
          ]
        }

      },
      actionExample() {
        return {
          type: this.isFilterRule ? "addRequestHeader" : "redirect",// 转发redirect
          data: {
            target: "",// 转发目标路径
            dataId: '', //返回数据文件的id
            modifyResponseType: '',// 修改响应内容类型
            callbackName: "", // jsonp请求参数名
            cookieKey: "", // 设置到请求里的cookie key
            cookieValue: "", // 设置到请求里的cookie value
            reqHeaderKey: "", // 请求header
            reqHeaderValue: "",
            resHeaderKey: "", // 响应header
            resHeaderValue: "",
            queryKey: "", // 请求query
            queryValue: "",
            modifyRequestScript: "", // 脚本修改请求
            modifyResponseScript: "" // 脚本修改响应
          }
        }
      }
    },
    methods: {

      editRule(rule, isFilterRule) {
        this.isFilterRule = isFilterRule;
        this.rule = JSON.parse(JSON.stringify(rule));
        this.visible = true;
      },

      createRule(isFilterRule = false) {
        this.isFilterRule = isFilterRule;
        this.rule = {
          name: "",
          key: uuidV4(),
          method: "",
          match: "",
          checked: true,
          actionList: [{
            type: "redirect",// 转发redirect  接口转发api 使用数据文件替换data
            data: {
              target: "",// 转发目标路径
              dataId: '', //返回数据文件的id
              modifyResponseType: '',// 修改响应内容类型
              callbackName: "", // jsonp请求参数名
              cookieKey: "", // 设置到请求里的cookie key
              cookieValue: "", // 设置到请求里的cookie value
              reqHeaderKey: "", // 请求header
              reqHeaderValue: "",
              resHeaderKey: "", // 响应header
              resHeaderValue: "",
              queryKey: "", // 请求query
              queryValue: "",
              modifyRequestScript: "", // 脚本修改请求
              modifyResponseScript: "" // 脚本修改响应
            }
          }]
        };
        this.visible = true;
      },

      setActionDataFileId(actionIndex, dataId) {
        this.rule.actionList[actionIndex].data.dataId = dataId;
      }
    }
  }
</script>

