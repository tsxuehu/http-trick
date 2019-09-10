<template>
    <div class="project-wraper">
        <div class="main-content__title">转发路径变量管理</div>
        <div class="project-path-info">配置http转发规则时，转发路径可以引用这里的变量。例如：将http请求转发到${ helloworld }/dist/hello.js，${
            helloworld }会被替换为变量helloworld对应的值。
        </div>
        <el-table
                :data="redirectPathVariableArray"
                style="width:100%;">
            <el-table-column
                    prop="key"
                    label="变量名"
                    width="250">
                <template v-slot:default="scope">
                    <el-input v-model="scope.row.key" placeholder="工程名"/>
                </template>
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="变量值">
                <template v-slot:default="scope">
                    <el-input v-model="scope.row.value" placeholder="工程在本地的绝对路径"/>
                </template>
            </el-table-column>
            <el-table-column
                    width="60"
                    label="操作">
                <template v-slot:default="scope">
                    <el-button
                            class="delete-btn"
                            type="danger"
                            icon='el-icon-delete'
                            size="mini"
                            @click='deleteParam(scope.row,scope.$index)'
                    />
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 50px;text-align: right;">
            <el-button @click="addParam">增加工程路径设置</el-button>
            <el-button type="primary" @click="saveFile">保存</el-button>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import forEach from 'lodash/forEach';
  import profileApi from 'src/api/profile';
  import './path-variable.scss'

  export default {
    name: 'project-path',
    data() {
      return {
        // 将工程路径配置转换为数组格式 方便编辑
        redirectPathVariableArray: []
      }
    },

    computed: {
      ...mapState(['profile']),
    },
    watch: {
      profile(val) {
        let result = [];
        forEach(val.redirectPathVariables, (value, key) => {
          result.push({
            key,
            value
          });
        });
        this.redirectPathVariableArray = result;
      }
    },
    methods: {
      deleteParam(row, index, list) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.redirectPathVariableArray.splice(index, 1);
        });
      },

      async saveFile() {
        let redirectPathVariableMap = {};
        forEach(this.redirectPathVariableArray, obj => {
          redirectPathVariableMap[obj.key] = obj.value;
        });
        let copyProfile = JSON.parse(JSON.stringify(this.profile));
        copyProfile.redirectPathVariables = redirectPathVariableMap;
        let response = await profileApi.saveFile(copyProfile);
        let serverData = response.data;
        if (serverData.code == 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message.error(`出错了，${serverData.msg}`);
        }
      },

      addParam() {
        this.redirectPathVariableArray.push({
          key: '',
          value: ''
        });
      }
    }
  };
</script>
