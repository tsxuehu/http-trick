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
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import ruleApi from '../../../api/rule';
  import * as RuleTestForm from '../../form-widget/rule-test-form/index.js'
  import * as RuleEditFormApi from '../../form-widget/rule-edit-form/index.js'
  import * as DataCreateFormApi from '../../form-widget/data-create-form/index.js'
  import * as DataEditFormApi from '../../form-widget/data-edit-form/index.js'

  import './edit-rule.scss'

  export default {
    name: 'edit-rule',

    data() {
      return {
        loaded: false,
        name: '',
        filecontent: {meta: {}},
      };
    },
    computed: {
      ...mapState(['dataList'])
    },
    methods: {
      setEventHandle() {
        RuleEditFormApi.setEventHandle({
          onNewDataFile: index => {
            this.requestNewDataFile(index);
          },
          onEditDataFile: dataFileEntry => {
            this.requestEditDataFile(dataFileEntry);
          },
          onTestRule: data => {
            this.testRule(data);
          },
          onSaveRule: data => {
            this.saveRule(data);
          },
        });
      },
      requestNewDataFile(actionIndex) {
        DataCreateFormApi.setEventHandle({
          onCreated: (id) => {
            RuleEditFormApi.setActionDataFileId(actionIndex, id);
          }
        });
        DataCreateFormApi.create();
      },

      requestEditDataFile(datafileEntry) {
        DataEditFormApi.edit(datafileEntry);
      },

      getFile() {
        this.loaded = false;
        this.name = this.$route.query.name;
        ruleApi.getFileContent(this.name).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.loaded = true;

            if (this.dataList.length > 0) {
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
        this.setEventHandle();
        RuleEditFormApi.createRule({});
      },

      onDuplicateRow(row, index) {
        this.setEventHandle();
        RuleEditFormApi.createRule({
          initialRule: row,
        });
      },

      onEditRule(row, index) {
        this.setEventHandle();
        RuleEditFormApi.editRule({
          rule: row,
          ruleIndex: index,
        });
      },

      onDeleteRow(row, index) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let copy = JSON.parse(JSON.stringify(this.filecontent));
          copy.content.splice(index, 1);
          this.saveFileRightNow(copy);
        });
      },


      saveRule({
                 isEditRule,
                 rule,
                 ruleIndex
               }) {
        let copy = JSON.parse(JSON.stringify(this.filecontent));
        if (isEditRule) {
          // 复制属性
          let originRule = copy.content[ruleIndex];
          Object.assign(originRule, rule);
        } else {
          copy.content.push(rule);
        }
        this.saveFileRightNow(copy);
      },

      /**
       * 立刻保存
       */
      saveFileRightNow(ruleFile) {
        this.saveFile(ruleFile);
        ruleApi.debouncedSaveFile.flush();
      },

      saveFile(ruleFile) {
        ruleApi.debouncedSaveFile(this.name, ruleFile, (response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功!'
            });
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
