<template>
    <div>
        <div class="main-content__title">编辑规则集{{ loaded ? ': ' + filecontent.name: '' }}</div>
        <div class="project-path-info">可以控制单个规则是否启用，当规则所在规则集没有启用时，规则不管是否启用，都不会生效。</div>
        <el-row :gutter="20" style="margin-bottom: 10px;text-align: right;">
            <el-col :span="6" :offset="18">
                <el-button size="small" @click='addRule'>新增规则</el-button>
            </el-col>
        </el-row>
        <el-table border style="width: 100%" row-key="key" :stripe="true" align='center' :data="filecontent.content">
            <el-table-column label="启用" align="center" width="80">
                <template scope='scope'>
                    <el-checkbox v-model="scope.row.checked" @change="saveFileRightNow"></el-checkbox>
                </template>
            </el-table-column>

            <el-table-column label="规则名" width="150" prop="name" align="center">
            </el-table-column>

            <el-table-column label="匹配方法" width="100" align="center">
                <template scope='scope'>
                    {{scope.row.method ? scope.row.method : "全部"}}
                </template>
            </el-table-column>

            <el-table-column label="匹配路径" prop="match" align="center">
            </el-table-column>

            <el-table-column label="操作" :width="200" align="center">
                <template scope='scope'>
                    <div class="action-panel">
                        <el-button type="danger" icon='el-icon-delete' size="mini"
                                   @click='onDeleteRow(scope.row, scope.$index)'>
                        </el-button>
                        <el-button icon='el-icon-document' size="mini"
                                   @click='onDuplicateRow(scope.row, scope.$index)'>
                        </el-button>
                        <el-button icon='el-icon-edit' size="mini"
                                   @click='onEditRule(scope.row, scope.$index)'>
                        </el-button>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <rule-edit-form :data-list="$dc.dataList"
                        :user-id="$dc.userId"
                        ref="ruleEditForm"
                        @new-data-file="requestNewDataFile"
                        @edit-data-file="requestEditDataFile"
                        @save="saveRule"></rule-edit-form>
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
  import ruleApi from '../../../api/rule';
  import RuleEditForm from '../rule-edit-form/Index.vue';

  export default {
    name: 'edit-rule',
    components: {
      [RuleEditForm.name]: RuleEditForm
    },
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
      };
    },
    methods: {
      requestNewDataFile(actionIndex) {
        let ruleEditForm = this.$refs.ruleEditForm;
        this.$dc.requestAddDataFile((id) => {
          ruleEditForm.setActionDataFileId(actionIndex, id);
        });
      },

      requestEditDataFile(datafileEntry) {
        this.$dc.requestEditDataFile(datafileEntry);
      },

      getFile() {
        this.loaded = false;
        this.name = this.$route.query.name;
        ruleApi.getFileContent(this.name).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.loaded = true;

            if (this.$dc.dataList.length > 0) {
              this.filecontent = serverData.data;
            } else {
              // element select bug， 通过此方法，避免没有option时select将model置为''，
              // 延迟1s，等待option数据加载
              setTimeout(() => {
                this.filecontent = serverData.data;
              }, 1000);
            }

          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        }).catch((error) => {
          // 便于本地开发使用 npm run dev
          this.filecontent = {
            meta: {},
            "content": []
          };
        });
      },

      addRule() {
        let ruleEditForm = this.$refs.ruleEditForm;
        ruleEditForm.createRule({});
      },

      onDuplicateRow(row, index) {
        let ruleEditForm = this.$refs.ruleEditForm;
        ruleEditForm.createRule({
          initialRule: row
        });
      },

      onEditRule(row, index) {
        let ruleEditForm = this.$refs.ruleEditForm;
        ruleEditForm.editRule({
          rule: row,
          ruleIndex: index,
        })
      },

      onDeleteRow(row, index) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.filecontent.content.splice(index, 1);
          this.saveFileRightNow();
        });
      },

      saveRule({
                 isEditRule,
                 rule,
                 ruleIndex
               }) {
        if (isEditRule) {
          // 复制属性
          let originRule = this.filecontent.content[ruleIndex];
          Object.assign(originRule, rule);
        } else {
          this.filecontent.content.push(rule);
        }
        this.saveFileRightNow();
      },

      /**
       * 立刻保存
       */
      saveFileRightNow() {
        this.saveFile();
        ruleApi.debouncedSaveFile.flush();
      },

      saveFile(donotalert) {
        ruleApi.debouncedSaveFile(this.name, this.filecontent, (response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            if (!donotalert) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功!'
              });
            }
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
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
      testMatchRuleRequest(row) {
        this.testMatchRuleForm.match = row.match;
        this.testMatchRuleForm.targetTpl = row.actionList[0] && row.actionList[0].data.target || '';
        this.testMatchRuleForm.url = '';
        this.testMatchRuleForm.matchRlt = '';
        this.testMatchRuleForm.targetRlt = '';
        this.testMatchRuleForm.msg = '';
        this.testMatchRuleFormVisible = true;
      },
      testMatchRule() {
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
      }
    }
  };

</script>
<style>
    .action-panel .btn-panel {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 10px;
    }
</style>
