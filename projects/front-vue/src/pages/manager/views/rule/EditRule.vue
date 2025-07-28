<template>
    <div>
        <div class="main-content__title">编辑规则集{{ loaded ? ': ' + filecontent.name: '' }}</div>
        <div class="project-path-info">可以控制单个规则是否启用，当规则所在规则集没有启用时，规则不管是否启用，都不会生效。</div>
        <el-row :gutter="20" style="margin-bottom: 10px;text-align: right;">
            <el-col :span="6" :offset="18">
                <el-button size="small" @click='addRule'>新增规则</el-button>
            </el-col>
        </el-row>
        <el-table border style="width: 100%" row-key="id" :stripe="true" align='center' :data="filecontent.ruleList">
            <el-table-column label="启用" align="center" width="80">
                <template v-slot:default="scope">
                    <el-checkbox :value="scope.row.checked" @input="toggleRuleCheckState(scope.row)"></el-checkbox>
                </template>
            </el-table-column>

            <el-table-column label="规则名" width="150" prop="name" align="center">
            </el-table-column>

            <el-table-column label="匹配方法" width="100" align="center">
                <template v-slot:default="scope">
                    {{scope.row.method ? scope.row.method : "全部"}}
                </template>
            </el-table-column>

            <el-table-column label="匹配路径" width="300" prop="match" align="center">
            </el-table-column>
            <el-table-column label="执行操作" prop="match" align="center">
                <template v-slot:default="scope">
                    <div>
                        <action-view v-for="action, index in scope.row.actionList"
                                     :action="action"
                                     :data-list="dataList" :key="index"></action-view>
                    </div>
                </template>
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
  import delay from 'delay'
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import ActionView from '../../components/ActionView';

  import * as ruleApi from 'src/api/rule';
  import * as RuleTestForm from '../../form-widget/rule-test-form/index.js'
  import * as RuleEditFormApi from '../../form-widget/rule-edit-form/index.js'
  import * as DataCreateFormApi from '../../form-widget/data-create-form/index.js'
  import * as DataEditFormApi from '../../form-widget/data-edit-form/index.js'

  import './edit-rule.scss'

  export default {
    name: 'edit-rule',
    components: {
      [ActionView.name]: ActionView
    },
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

      async getFile() {
        this.loaded = false;
        this.ruleFileId = this.$route.query.id;
        let response = await  ruleApi.getFileContent(this.ruleFileId);
        var serverData = response.data;

        if (serverData.code == 0) {
          this.filecontent = serverData.data;
          this.loaded = true;
        } else {
          this.$message.error(`出错了，${serverData.msg}`);
        }

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

      onEditRule(rule, index) {
        this.setEventHandle();
        RuleEditFormApi.editRule({
          rule: rule,
          ruleIndex: index,
        });
      },

      async onDeleteRow(rule, index) {
        await this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await ruleApi.removeRule(this.filecontent.id, rule.id);
        await this.getFile();
        await delay(500);
        loading.close();
      },
      async toggleRuleCheckState(rule) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await ruleApi.setRuleCheckedState(
          this.filecontent.id,
          rule.id,
          !rule.checked);
        await this.getFile();
        await delay(500);
        loading.close();
      },
      async saveRule({
                       isEditRule,
                       rule,
                       ruleIndex
                     }) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await ruleApi.saveRule(this.filecontent.id, rule);
        await this.getFile();
        await delay(500);
        loading.close();
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
