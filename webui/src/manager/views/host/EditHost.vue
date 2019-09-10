<template>
    <div>
        <div class="main-content__title">编辑Host文件{{ loaded ? ': ' + filecontent.name : '' }}</div>
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6" :offset="18">
                <el-button size="small" type="primary" @click='saveFile'>保存文件</el-button>
            </el-col>
        </el-row>
        <textarea class="host-editor" :placeholder="hostExample" v-model="filecontent.content"></textarea>
    </div>
</template>

<script>
  import hostApi from 'src/api/host';
  import forEach from 'lodash/forEach';
  import './edit-host.scss'

  export default {
    name: 'app',
    data() {
      return {
        loaded: false,
        filecontent: {
          content: ''
        }
      };
    },
    computed: {
      hostExample() {
        return `#示例
8.8.8.8    www.google.com
4.4.4.4    *.taobao.com #所有后缀为.taobao.com的域名都被解析为4.4.4.4
6.6.6.6    www.youzan.com h5.youzan.com`
      }
    },

    methods: {
      getFile() {
        this.loaded = false;
        hostApi.getFileContent(this.$route.query.name).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.loaded = true;
            this.filecontent = serverData.data;
            // 解析host数组
            this.hostarray = [];
            forEach(this.filecontent.content, (value, key) => {
              this.hostarray.push({
                key: key,
                value: value
              });
            });
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },
      saveFile() {
        hostApi.saveFile(this.$route.query.name, this.filecontent).then((response) => {
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
