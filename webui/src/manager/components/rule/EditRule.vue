<template>
  <div>
    <div class="main-content__title">编辑规则集{{ loaded ? ': ' + filecontent.name: '' }}</div>
    <el-row :gutter="20" style="margin-bottom: 10px;text-align: right;">
      <el-col :span="6" :offset="18">
        <el-button size="small" @click='addRule' :disabled='filecontent.meta.remote'>新增规则</el-button>
        <el-button size="small" type="primary" @click='saveFileRightNow'>保存规则集</el-button>
      </el-col>
    </el-row>
    <el-table border style="width: 100%" row-key="key" :stripe="true" align='center' :data="filecontent.content">
      <el-table-column prop="checked" label="启用" align="center" width="80">
        <template scope='scope'>
          <el-tooltip class="item" effect="dark" content="勾选后启动这条规则" placement="left">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="规则设置" align="center">
        <template scope='scope'>
          <rule-detail :rule="scope.row" :remote="filecontent.meta.remote"></rule-detail>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="100" align="center" :context="_self">
        <template scope='scope'>
          <div v-if="!filecontent.meta.remote">
            <el-tooltip class="item" effect="dark" content="复制" placement="left">
              <el-button icon='el-icon-document' size="mini"
                         @click='onDuplicateRow(scope.row,scope.$index,filecontent.content)'>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon='el-icon-delete' size="mini"
                         @click='onDeleteRow(scope.row,scope.$index,filecontent.content)'>
              </el-button>
            </el-tooltip>
          </div>
          <div style="    text-align: left; padding-left: 2px;margin-top: 5px;">
            <el-tooltip class="item" effect="dark" content="测试规则" placement="left">
              <el-button type="blue" icon='el-icon-search' size="mini"
                         @click='testMatchRuleRequest(scope.row)'>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 测试正则匹配对话框 -->
    <el-dialog title="匹配规则测试(只测试正则匹配，不包含请求方法)" v-model="testMatchRuleFormVisible" size="large">
      <el-form :model="testMatchRuleForm" label-width="120px">
        <el-form-item label="请求url">
          <el-input v-model="testMatchRuleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="匹配条件">
          <el-input v-model="testMatchRuleForm.match"></el-input>
        </el-form-item>
        <el-form-item label="转发路径">
          <el-input v-model="testMatchRuleForm.targetTpl"></el-input>
        </el-form-item>
        <el-form-item label="匹配结果">
          <el-input v-model="testMatchRuleForm.matchRlt" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最终目标路径">
          <el-input v-model="testMatchRuleForm.targetRlt" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="其他信息">
          <el-input v-model="testMatchRuleForm.msg" type="textarea" :disabled="true"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="testMatchRuleFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="testMatchRule">测 试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ruleApi from '../../../api/rule'
  import _ from 'lodash';
  import uuidV4  from 'uuid/v4';
  import RuleDetail from './RuleDetail';
  import Vue from 'vue';
  Vue.component(RuleDetail.name, RuleDetail);

  export default {
    name: 'edit-rule',
    data() {
      return {
        loaded: false,
        name: '',
        filecontent: {meta: {}},
        testMatchRuleFormVisible: false,
        testMatchRuleForm: {
          url: '',// 请求url
          match: '',// url匹配规则
          targetTpl: '',// 路径模板， 会用urlReg的匹配结果来替换targetTpl $1 $2
          matchRlt: '',// url匹配结果
          targetRlt: '',// 路径匹配结果
          msg: ''
        }
      }
    },
    methods: {
      getFile() {
        this.loaded = false;
        this.name = this.$route.query.name;
        ruleApi.getFileContent(this.$route.query.name).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.loaded = true;
            // 补齐缺失的key,兼容老版本
            _.forEach(serverData.data.content, (rule) => {
              rule.key = rule.key || uuidV4();
            });

            if (this.$dc.dataList.length > 0) {
              this.filecontent = serverData.data;
            } else {
              // element select bug， 通过此方法，避免没有option时select将model置为''，
              // 延迟1s，等待option数据加载
              setTimeout(()=>{
                this.filecontent = serverData.data;
              },1000);
            }

          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        }).catch((error) => {
          // 便于本地开发使用 npm run dev
          this.filecontent = {
            meta: {},
            "content": []
          }
        });
      },
      onDeleteRow(row, index, list) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.filecontent.content.splice(index, 1);
        })
      },
      onDuplicateRow(row, index, list) {
        var copy = _.cloneDeep(this.filecontent.content[index])
        this.filecontent.content.splice(index, 0, copy);
      },
      /**
       * 立刻保存
       */
      saveFileRightNow(){
        this.saveFile();
        ruleApi.debouncedSaveFile.flush();
      },
      saveFile(donotalert) {
        ruleApi.debouncedSaveFile(this.name, this.filecontent, (response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            if (!donotalert) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
            }
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        })
      },
      addRule() {
        this.filecontent.content.unshift({
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
                headerKey: "",
                headerValue: "",
                modifyRequestScript: "",
                modifyResponseScript: ""
            }
          }]
        })
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
      testMatchRuleRequest(row){
        this.testMatchRuleForm.match = row.match;
        this.testMatchRuleForm.targetTpl = row.actionList[0] && row.actionList[0].data.target || '';
        this.testMatchRuleForm.url = '';
        this.testMatchRuleForm.matchRlt = '';
        this.testMatchRuleForm.targetRlt = '';
        this.testMatchRuleForm.msg = '';
        this.testMatchRuleFormVisible = true;
      },
      testMatchRule(){
        ruleApi.testRule(this.testMatchRuleForm).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.testMatchRuleForm.matchRlt = serverData.data.matchRlt;
            this.testMatchRuleForm.targetRlt = serverData.data.targetRlt;
            this.testMatchRuleForm.msg = serverData.data.msg;
          }
        });
      }
    },
    mounted() {
      this.getFile();
    },
    watch: {
      '$route'(to, from) {
        this.getFile();
      },
      // 自动保存
      /*filecontent: {
        handler(newVal, oldVal){
          if (oldVal.content) {
            this.saveFile(true);
          }
        },
        deep: true
      }*/
    }
  }

</script>
