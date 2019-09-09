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
                <template v-slot:default="scope">
                    <el-checkbox v-model="scope.row.checked" @change="saveFileRightNow"></el-checkbox>
                </template>
            </el-table-column>

            <el-table-column label="规则名" width="150" prop="name" align="center">
            </el-table-column>

            <el-table-column label="匹配方法" width="100" align="center">
                <template v-slot:default="scope">
                    {{scope.row.method ? scope.row.method : "全部"}}
                </template>
            </el-table-column>

            <el-table-column label="匹配路径" prop="match" align="center">
            </el-table-column>

            <el-table-column label="操作" :width="200" align="center">
                <template v-slot:default="scope">
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
    </div>
</template>

<script>
  import ruleApi from '../../../api/rule';
  import * as RuleTestForm from '../../form-widget/rule-test-form/index.js'
  import * as RuleEditForm from '../../form-widget/rule-edit-form/index.js'
  export default {
    name: 'edit-rule',

    data() {
      return {
        loaded: false,
        name: '',
        filecontent: {meta: {}},
      };
    },
    methods: {
      requestNewDataFile(actionIndex) {
        this.$dc.requestAddDataFile((id) => {
          RuleEditForm.setActionDataFileId(actionIndex, id);
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

      testRule({rule, actionIndex}) {
        RuleTestForm.test({
          rule, actionIndex
        })
      },
      addRule() {
        RuleEditForm.createRule({
          onNewDataFile: index => { this.requestNewDataFile(index); },
          onEditDataFile: dataFileEntry => { this.requestEditDataFile(dataFileEntry); },
          onTestRule: data => { this.testRule(data); },
          onSaveRule: data => { this.saveRule(data); },
          dataList: this.$dc.dataList,
          userId: this.$dc.userId
        });
      },

      onDuplicateRow(row, index) {
        RuleEditForm.createRule({
          initialRule: row,
          onNewDataFile: index => { this.requestNewDataFile(index); },
          onEditDataFile: dataFileEntry => { this.requestEditDataFile(dataFileEntry); },
          onTestRule: data => { this.testRule(data); },
          onSaveRule: data => { this.saveRule(data); },
          dataList: this.$dc.dataList,
          userId: this.$dc.userId
        });
      },

      onEditRule(row, index) {
        RuleEditForm.editRule({
          rule: row,
          ruleIndex: index,
          onNewDataFile: index => { this.requestNewDataFile(index); },
          onEditDataFile: dataFileEntry => { this.requestEditDataFile(dataFileEntry); },
          onTestRule: data => { this.testRule(data); },
          onSaveRule: data => { this.saveRule(data); },
          dataList: this.$dc.dataList,
          userId: this.$dc.userId
        });
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
