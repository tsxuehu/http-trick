<template>
    <div>
        <div class="main-content__title">过滤器</div>
        <div class="project-path-info">一个http请求会可以执行多个匹配的过滤器；过滤器可以用于向http请求里植入登录态。可以控制单个过滤器是否启用</div>
        <el-row :gutter="20" style="margin-bottom: 10px;text-align: right;">
            <el-col :span="6" :offset="18">
                <el-button size="small" @click='addRule'>新增过滤器</el-button>
            </el-col>
        </el-row>
        <el-table border style="width: 100%" row-key="key" :stripe="true" align='center' :data="$dc.filters">
            <el-table-column prop="checked" label="启用" align="center" width="80">
                <template v-slot:default="scope">
                    <el-checkbox v-model="scope.row.checked"
                                 @change="saveFileRightNow"
                                 :disabled="!$dc.filterState"></el-checkbox>
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
  import filtersApi from '../../../api/filter';
  import * as RuleTestForm from '../../form-widget/rule-test-form/index.js'
  import * as RuleEditForm from '../../form-widget/rule-edit-form/index.js'

  import './index.scss'

  export default {
    name: 'filters',
    methods: {

      addRule() {
        RuleEditForm.createRule({
          isFilterRule: true,
          onTestRule: data => { this.testRule(data); },
          onSaveRule: data => { this.saveRule(data); },
          dataList: this.$dc.dataList,
          userId: this.$dc.userId
        });
      },
      onDuplicateRow(row, index) {
        RuleEditForm.createRule({
          initialRule: row,
          isFilterRule: true,
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
          isFilterRule: true,
          onTestRule: data => { this.testRule(data); },
          onSaveRule: data => { this.saveRule(data); },
          dataList: this.$dc.dataList,
          userId: this.$dc.userId
        });
      },
      onDeleteRow(row, index, list) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$dc.filters.splice(index, 1);
          this.saveFileRightNow();
        });
      },
      testRule({rule, actionIndex}) {
        RuleTestForm.test({
          rule, actionIndex
        })
      },
      saveRule({
                 isEditRule,
                 rule,
                 ruleIndex
               }) {
        if (isEditRule) {
          // 复制属性
          let originRule = this.$dc.filters[ruleIndex];
          Object.assign(originRule, rule);
        } else {
          this.$dc.filters.push(rule);
        }
        this.saveFileRightNow();
      },
      /**
       * 立刻保存
       */
      async saveFileRightNow() {
        let result = await filtersApi.saveFilters(this.$dc.filters);
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
