<template>
    <el-dialog :title="isEditRule?'编辑规则': '新建规则'"
               :close-on-click-modal="false"
               :visible.sync="visible"
               width="900px">
        <div class="rule-edit-form">
            <div class="config-row">
                <span class="config-name">规则名:</span>
                <span class="config-value">
                    <el-input v-model="rule.name" size="small" placeholder="方便记忆规则"></el-input>
                </span>
            </div>
            <div class="config-row">
                <span class="config-name">匹配规则:</span>
                <span class="config-value match-rule">
                    <div class="match-method">
                        <el-select
                                v-model="rule.method"
                                size="small"
                                placeholder="请选择">
                            <el-option v-for="item in methodList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="tips">
                            不要忘记选择匹配请求方法
                        </span>
                    </div>
                    <div class="match-reg">
                        <el-input
                                v-model="rule.match"
                                size="small"
                                placeholder="填写要拦截的url中部分连续的字符串，或者匹配要拦截url的正则表达式">
                        </el-input>
                        <el-button type="text" @click="doTestRule(-1)">
                            测试
                        </el-button>
                    </div>

                </span>
            </div>
            <div class="rule-actions">执行操作</div>
            <div>
                <el-table highlight-current-row :data="rule.actionList">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column prop="name" label="操作" width="180">
                        <template v-slot:default="{row, $index}">
                            <el-select v-model="row.type" placeholder="请选择" size="small">
                                <el-option v-for="item in ruleTypes" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="参数">
                        <template v-slot:default="{row, $index}">
                            <action-value :action="row"
                                          :data-list="dataList"
                                          :allow-redirect-to-local="allowRedirectToLocal"
                                          @new-data-file="doNewDataFile($index)"
                                          @edit-data-file="doEditDataFile($event)"
                                          @test-rule="doTestRule($index)">
                            </action-value>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :width="60" align="center">
                        <template v-slot:default="{row, $index}">
                            <el-button type="danger" icon='el-icon-delete' size="mini"
                                       @click='deleteAction($index)'/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 按钮 -->
            <div class="bottom-action">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="addAction">新增动作</el-button>
                <el-button type="primary" @click="doSaveRule">{{isEditRule?'保存规则': '创建规则'}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  import RuleActionValue from './RuleActionValue.vue';
  import uuidV4 from 'uuid/v4';
  import './index.scss'

  const DefaultRule = {
    name: "",
    key: '',
    method: "",
    match: "",
    checked: false,
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
    name: "RuleEditForm",
    props: ['dataList', 'userId'],
    components: {
      [RuleActionValue.name]: RuleActionValue
    },
    data() {
      return {
        visible: false,
        isFilterRule: false, // 是否是过滤器规则
        isEditRule: false, // 是否编辑规则
        rule: JSON.parse(JSON.stringify(DefaultRule)),
        ruleIndex: -1, // 用来记录被编辑的rule 索引
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
      allowRedirectToLocal() {
        return this.userId == 'root'
      },
      ruleTypes() {
        if (this.isFilterRule) {
          return [
            //  {value: 'redirect', label: '转发请求'},
            //  {value: 'mockData', label: '返回自定义数据'},
            {value: 'addQuery', label: '增加Query'},
            {value: 'addRequestCookie', label: '设置请求cookie'},
            {value: 'addRequestHeader', label: '增加请求头'},
            {value: 'addResponseHeader', label: '增加响应头'},
            //  {value: 'modifyResponse', label: '修改响应内容'},
            {value: 'scriptModifyRequest', label: 'js修改请求内容'},
            {value: 'scriptModifyResponse', label: 'js修改响应内容'}
          ]
        } else {
          return [
            {value: 'redirect', label: '转发请求'},
            {value: 'mockData', label: '返回自定义数据'},
            {value: 'addQuery', label: '增加Query'},
            {value: 'addRequestCookie', label: '设置请求cookie'},
            {value: 'addRequestHeader', label: '增加请求头'},
            {value: 'addResponseHeader', label: '增加响应头'},
            {value: 'modifyResponse', label: '修改响应内容'},
            {value: 'scriptModifyRequest', label: 'js修改请求内容'},
            {value: 'scriptModifyResponse', label: 'js修改响应内容'}
          ]
        }
      },
    },
    methods: {
      setEventHandle({
                       onNewDataFile, onEditDataFile, onTestRule, onSaveRule
                     }) {
        this.onNewDataFile = onNewDataFile;
        this.onEditDataFile = onEditDataFile;
        this.onTestRule = onTestRule;
        this.onSaveRule = onSaveRule;
      },
      createRule({
                   initialRule,
                   isFilterRule = false,
                 }) {
        this.ruleIndex = -1;
        this.isEditRule = false;
        this.isFilterRule = isFilterRule;
        let rule;

        if (initialRule) {
          rule = JSON.parse(JSON.stringify(initialRule));
        } else {
          rule = JSON.parse(JSON.stringify(DefaultRule));
          let action = JSON.parse(JSON.stringify(DefaultAction));
          action.type = this.isFilterRule ? "addRequestHeader" : "redirect";// 转发redirect
          rule.actionList.push(action);
        }
        rule.key = uuidV4();

        this.rule = rule;
        this.visible = true;
      },
      editRule({
                 rule, isFilterRule, ruleIndex
               }) {
        this.isEditRule = true;
        this.ruleIndex = ruleIndex;
        this.isFilterRule = isFilterRule;
        this.rule = JSON.parse(JSON.stringify(rule));
        this.visible = true;
      },
      setActionDataFileId(actionIndex, dataId) {
        this.rule.actionList[actionIndex].data.dataId = dataId;
      },
      addAction() {
        let action = JSON.parse(JSON.stringify(DefaultAction));
        action.type = this.isFilterRule ? "addRequestHeader" : "redirect";// 转发redirect
        this.rule.actionList.push(action);
      },

      deleteAction(index) {
        this.rule.actionList.splice(index, 1);
      },
      doNewDataFile(index) {
        this.$emit('new-data-file', index);
        if (this.onNewDataFile) {
          this.onNewDataFile(index);
        }
      },
      doEditDataFile(dataFileEntry) {
        this.$emit('edit-data-file', dataFileEntry);
        if (this.onEditDataFile) {
          this.onEditDataFile(dataFileEntry);
        }
      },
      doTestRule(index) {
        let data = {actionIndex: index, rule: this.rule};
        this.$emit('test-rule', data);
        if (this.onTestRule) {
          this.onTestRule(data);
        }
      },
      doSaveRule() {
        let data = {
          isEditRule: this.isEditRule,
          ruleIndex: this.ruleIndex,
          rule: JSON.parse(JSON.stringify(this.rule))
        };
        this.$emit('save', data);
        if (this.onSaveRule) {
          this.onSaveRule(data);
        }
        this.visible = false;
      },
      cancelEdit() {
        this.visible = false;
      },

    }
  }
</script>

