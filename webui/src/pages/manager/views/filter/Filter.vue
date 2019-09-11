<template>
    <div>
        <div class="main-content__title">过滤器</div>
        <div class="project-path-info">一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用</div>
        <el-row :gutter="20" style="margin-bottom: 10px;text-align: right;">
            <el-col :span="6" :offset="18">
                <el-button size="small" @click='addRule'>新增过滤器</el-button>
            </el-col>
        </el-row>
        <el-table border style="width: 100%" row-key="id" :stripe="true" align='center' :data="filters">
            <el-table-column prop="checked" label="启用" align="center" width="80">
                <template v-slot:default="scope">
                    <el-checkbox :value="scope.row.checked"
                                 @input="toggleRuleCheckState(scope.row)"
                                 :disabled="!enableFilter"></el-checkbox>
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

            <el-table-column label="操作" width="200" align="center">
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
  import * as filtersApi from 'src/api/filter';
  import * as RuleTestForm from '../../form-widget/rule-test-form/index.js'
  import * as RuleEditFormApi from '../../form-widget/rule-edit-form/index.js'

  import './index.scss'

  export default {
    name: 'filters',
    computed: {
      ...mapState(['filters']),
      ...mapGetters(['enableFilter'])
    },
    methods: {
      setEventHandle() {
        RuleEditFormApi.setEventHandle({
          onTestRule: data => {
            this.testRule(data);
          },
          onSaveRule: data => {
            this.saveRule(data);
          },
        });
      },
      addRule() {
        this.setEventHandle();
        RuleEditFormApi.createRule({
          isFilterRule: true,
        });
      },
      onDuplicateRow(row, index) {
        this.setEventHandle();
        RuleEditFormApi.createRule({
          initialRule: row,
          isFilterRule: true,
        });
      },
      onEditRule(row, index) {
        this.setEventHandle();
        RuleEditFormApi.editRule({
          rule: row,
          ruleIndex: index,
          isFilterRule: true,
        });
      },
      async onDeleteRow(rule) {
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
        filtersApi.removeRule(rule.id);
        loading.close();
      },
      testRule({rule, actionIndex}) {
        RuleTestForm.test({
          rule, actionIndex
        })
      },
      toggleRuleCheckState(rule) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        filtersApi.setRuleCheckedState(rule.id, !rule.checked);
        loading.close();
      },
      saveRule({
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
        filtersApi.saveRule(rule);
        loading.close();
      },
      /**
       * 立刻保存
       */
      async saveFileRightNow(filters) {
        let result = await filtersApi.saveFilters(filters);
        if (result.code == 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功!'
          });
        }
      }
    }
  };

</script>
