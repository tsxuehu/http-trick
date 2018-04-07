<template>
  <div class="project-wraper">
    <div class="main-content__title">工程路径管理</div>
    <div class="project-path-info">http请求转发到本地文件时可以引用这里的路径。例如：将http请求转发到<%= helloworld %>/dist/hello.js，<%= helloworld %>会被替换为工程名为helloworld对应的路径。</div>
    <el-form label-width="100px">
      <template v-for="(obj ,index) in $dc.projectPathArray">
        <div class="project-path">
          <div class="left">
            <el-form-item label="工程名">
              <el-input v-model="obj.key" placeholder="工程名" />
            </el-form-item>
            <el-form-item label="路径">
              <el-input v-model="obj.value" placeholder="工程在本地的绝对路径" />
            </el-form-item>
          </div>
          <div class="right">
            <el-button
                    class="delete-btn"
                    type="danger"
                    icon='el-icon-delete'
                    size="mini"
                    @click='deleteParam(obj,index,projectPathArray)'
            />
          </div>
        </div>
      </template>
      
      <el-form-item>
        <el-button @click="addParam">增加工程路径设置</el-button>
        <el-button type="primary" @click="saveFile">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import profileApi from '../../../api/profile';
import './project.pcss'
import forEach from 'lodash/forEach';

export default {
  name: 'project-path',

  methods: {
    deleteParam(row, index, list) {
      this.$confirm('此操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$dc.projectPathArray.splice(index, 1);
      });
    },

    async saveFile() {
      var projectPathMap = {};
      forEach(this.$dc.projectPathArray, obj => {
        projectPathMap[obj.key] = obj.value;
      });
      this.$dc.profile.projectPath = projectPathMap;
      let response = await profileApi.saveFile(this.$dc.profile);
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
      this.$dc.projectPathArray.push({
        key: '',
        value: ''
      });
    }
  }
};
</script>
