<template>
  <div>
    <div class='bread'>
      <strong>基础配置修改</strong>
    </div>
    <el-form :model="filecontent" ref="ruleForm" label-width="250px" class="demo-ruleForm"
             style="margin:20px;width:80%;min-width:800px;">
      <el-form-item label="代理端口">
        <el-input v-model="$dc.conf.proxyPort" placeholder="proxy的代理端口"></el-input>
      </el-form-item>
      <el-form-item label="超时时间">
        <el-input v-model="$dc.conf.requestTimeoutTime"  placeholder="远程服务器响应超时，proxy会终止请求"></el-input>
      </el-form-item>
      <el-form-item label="gitlab token">
        <el-input v-model="$dc.conf.gitlabToken" placeholder="请填写你在gitlab上的token (proxy访问gitlab上的文件需要token)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveFile">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import confApi from '../../../api/conf';
  import forEach from 'lodash/forEach';
  export default {
    name: 'configure',
    methods: {
      deleteParam(row, index, list) {
        this.$confirm('此操作不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$dc.paramarray.splice(index, 1);
        })
      },
      saveFile() {
        // 由host数组组装文件
        var responderParams = {};
        forEach(this.$dc.paramarray, (obj) => {
          responderParams[obj.key] = obj.value;
        });
        this.$dc.conf.responderParams = responderParams;
        this.$dc.conf.requestTimeoutTime = parseInt(this.$dc.conf.requestTimeoutTime);
        this.$dc.conf.proxyPort = parseInt(this.$dc.conf.proxyPort);
        confApi.saveFile(this.$dc.conf).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },
      addParam() {
        this.$dc.paramarray.push({
          key: "",
          value: ""
        })
      }
    }
  }

</script>
