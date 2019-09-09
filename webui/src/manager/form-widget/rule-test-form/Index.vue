<template>
    <el-dialog title="匹配-转发 测试"
               :close-on-click-modal="false"
               :visible.sync="visible"
               width="800px">
        <div class="test-rule-form">
            <el-form :model="testMatchRuleForm"
                     label-width="120px">
                <el-form-item label="请求">
                    <el-select
                            v-model="testMatchRuleForm.requestMethod"
                            size="small"
                            placeholder="请选择">
                        <el-option v-for="item in requestMethodList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input size="small"
                              v-model="testMatchRuleForm.requestUrl"></el-input>
                </el-form-item>
                <el-form-item label="匹配条件">
                    <el-select
                            v-model="testMatchRuleForm.matchMethod"
                            size="small"
                            placeholder="请选择">
                        <el-option v-for="item in matchMethodList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input size="small"
                              v-model="testMatchRuleForm.matchUrl"></el-input>
                </el-form-item>
                <el-form-item label="转发路径">
                    <el-input size="small"
                              v-model="testMatchRuleForm.target"></el-input>
                </el-form-item>
                <el-form-item label="匹配结果">
                    <el-input size="small"
                              v-model="testMatchRuleForm.matchResult" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="转发结果">
                    <el-input size="small"
                              v-model="testMatchRuleForm.redirectResult" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="其他信息">
                    <el-input size="small"
                              v-model="testMatchRuleForm.message" type="textarea" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div class="bottom-action">
                <el-button @click="cancel">关 闭</el-button>
                <el-button type="primary" @click="testMatchRule">测 试</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  import ruleApi from 'src/api/rule';
  import './rule-test-form.scss'

  export default {
    name: "RuleTestForm",
    components: {},
    data() {
      return {
        visible: false,
        testMatchRuleForm: {
          requestMethod: '',// 请求method
          requestUrl: '',// 请求url
          matchMethod: '',// 匹配method
          matchUrl: '',// 匹配url
          target: '', // 转发目标
          matchResult: '', // 匹配结果
          redirectResult: '',// 转发结果
          message: '',
        },
        matchMethodList: [
          {value: '', label: '所有'},
          {value: 'get', label: 'GET'},
          {value: 'post', label: 'POST'},
          {value: 'put', label: 'PUT'},
          {value: 'patch', label: 'PATCH'},
          {value: 'delete', label: 'DELETE'},
          {value: 'option', label: 'OPTION'}
        ],
        requestMethodList: [
          {value: 'get', label: 'GET'},
          {value: 'post', label: 'POST'},
          {value: 'put', label: 'PUT'},
          {value: 'patch', label: 'PATCH'},
          {value: 'delete', label: 'DELETE'},
          {value: 'option', label: 'OPTION'}
        ]
      }
    },
    methods: {
      cancel() {
        this.visible = false;
      },

      /**
       url: '',// 请求url
       urlMatch: '',// url匹配规则
       urlReg: '',// url的正则，用于路径替换
       targetTpl: '',// 路径模板， 会用urlReg的匹配结果来替换targetTpl $1 $2
       matchRlt:'',// url匹配结果
       targetRlt: ''// 路径匹配结果
       * @param row
       */
      testRule({
                 match, method, target
               }) {
        this.testMatchRuleForm = {
          requestMethod: '',// 请求method
          requestUrl: '',// 请求url
          matchMethod: method,// 匹配method
          matchUrl: match,// 匹配url
          target: target, // 转发末班
          matchResult: '', // 匹配结果
          redirectResult: '',// 转发结果
          message: '',
        };
        this.visible = true;
      },

      testMatchRule() {
        ruleApi.testRule(this.testMatchRuleForm).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.testMatchRuleForm.matchResult = serverData.data.matchResult;
            this.testMatchRuleForm.redirectResult = serverData.data.redirectResult;
            this.testMatchRuleForm.message = serverData.data.message;
          }
        });
      }
    }
  }
</script>

