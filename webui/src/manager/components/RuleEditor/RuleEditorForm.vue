<template>
    <el-dialog :title="isEditRule?'编辑规则': '新建规则'" :visible.sync="visible">
        <div style="text-align: left">
            <!-- 条件，说明 -->
            <div class="el-form demo-form-inline el-form--inline conditon">
                <div class="el-form-item" style="margin-bottom:8px;">
                    <label class="el-form-item__label">条件</label>
                    <div class="el-form-item__content">
                        <el-select v-model="rule.method" style="width: 100px;" size="small" placeholder="请选择">
                            <el-option v-for="item in methodList" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="el-form-item"
                     style="margin-bottom:8px;width: calc(100% - 170px);padding-left: 20px;margin-right: 0px">
                    <div class="el-form-item__content" style="width: 100%">
                        <el-input v-model="rule.match" style="width: 100%" size="small"
                                  placeholder="填写要拦截的url中部分连续的字符串，或者匹配要拦截url的正则表达式"></el-input>
                    </div>
                </div>
            </div>
            <!-- 规则说明 -->
            <div style="padding: 10px 0;">
                <span style="width: 85%;display: inline-block">
                    <el-input v-model="rule.name" size="small" placeholder="规则说明，写一段文字，方便记忆这个规则的作用"></el-input>
                </span>
                <span style="width: 10%;display: inline-block">
                    <el-button type="text" @click="addAction">新增动作</el-button>
                </span>
            </div>
            <!-- action展示 -->
            <div>
                <div v-for="action,index in rule.actionList" :key="index" class="dashed-border">
                    <span style="width: 85%;display: inline-block">
                        <action-detail :action="action"
                                       :rule-types="ruleTypes"
                                       :data-list="dataList"
                                       :user-id="userId"
                                       @new-data-file="$emit('new-data-file', index)"
                                       @edit-data-file="$emit('edit-data-file', $event)"></action-detail>
                    </span>
                    <span style="width: 10%;display: inline-block;vertical-align: bottom;line-height: 107px;height: 107px;">
                        <el-button type="text" @click="deleteAction(index)">删除动作</el-button>
                    </span>
                </div>
            </div>
            <!-- 按钮 -->
            <div>
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="saveRule">{{isEditRule?'保存规则': '创建规则'}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  import ActionDetail from './ActionDetail.vue';
  import './index.css'

  const DefaultRule = {
    name: "",
    key: '',
    method: "",
    match: "",
    checked: true,
    actionList: []
  };
  const DefaultAction = {
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
  };
  export default {
    name: "RuleEditorForm",
    props: ['dataList', 'userId'],
    components: {
      [ActionDetail.name]: ActionDetail
    },
    data() {
      return {
        visible: false,
        isFilterRule: false, // 是否是过滤器规则
        isEditRule: false, // 是否编辑规则
        rule: JSON.parse(JSON.stringify(DefaultRule)),
        methodList: [
          {value: '', label: '所有'},
          {value: 'get', label: 'GET'},
          {value: 'post', label: 'POST'},
          {value: 'put', label: 'PUT'},
          {value: 'patch', label: 'PATCH'},
          {value: 'delete', label: 'DELETE'},
          {value: 'option', label: 'OPTION'}
        ]
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
    },
    methods: {
      cancelEdit() {
        this.visible = false;
      },

      saveRule() {

      },

      editRule(rule, isFilterRule) {
        this.isEditRule = true;
        this.isFilterRule = isFilterRule;
        this.rule = JSON.parse(JSON.stringify(rule));
        this.visible = true;
      },

      createRule(isFilterRule = false) {
        this.isEditRule = false;
        this.isFilterRule = isFilterRule;
        let rule = JSON.parse(JSON.stringify(DefaultRule));
        rule.key = uuidV4();
        let action = JSON.parse(JSON.stringify(DefaultAction));
        action.type = this.isFilterRule ? "addRequestHeader" : "redirect";// 转发redirect
        rule.actionList.push(action);
        this.rule = rule;
        this.visible = true;
      },

      addAction() {
        let action = JSON.parse(JSON.stringify(DefaultAction));
        action.type = this.isFilterRule ? "addRequestHeader" : "redirect";// 转发redirect
        this.rule.actionList.push(action);
      },

      deleteAction(index) {
        this.rule.actionList.splice(index, 1);
      },

      setActionDataFileId(actionIndex, dataId) {
        this.rule.actionList[actionIndex].data.dataId = dataId;
      }
    }
  }
</script>

