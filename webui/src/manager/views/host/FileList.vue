<template>
    <div class="host-view">
        <div class="main-content__title">Host 文件列表</div>
        <div class="project-path-info">只允许一个host文件生效。</div>
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6" :offset="18" class="addhost-btn-wrap">
                <el-button size="small" @click='addNewHostFile'>新增 Host 文件</el-button>
            </el-col>
        </el-row>
        <el-table border align='center' :data="hostFileList">
            <el-table-column prop="name" label="名字" width="150">
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作" :width="136" :context="_self">
                <template v-slot:default="scope">
                    <a :href="'#/edithost?name='+scope.row.name">
                        <el-button type="info" icon='el-icon-edit' size="mini">
                        </el-button>
                    </a>
                    <el-button
                            type="danger"
                            icon='el-icon-delete'
                            size="mini"
                            @click="onDeleteFile(scope.row,scope.$index,user_list)"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="checked" label="启用" width="85">
                <template v-slot:default="scope">
                    <el-radio v-model="selectedFileName" :label="scope.row.name" :disabled="!enableHost"/>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import hostApi from '../../../api/host'
  import find from 'lodash/find'
  import './file-list.scss'

  export default {
    name: 'hostlist',

    computed: {
      ...mapState(['hostFileList']),
      ...mapGetters(['enableHost']),
      selectedFileName: {
        get() {
          // 遍历找出选择的文件
          var selectedFile = find(this.hostFileList, (file) => {
            return file.checked;
          });
          return selectedFile ? selectedFile.name : '';
        },
        set(value) {
          this.useFile(value);
        }
      }
    },
    methods: {
      onDeleteFile(row, index, list) {
        this.$confirm(`此操作将永久删除该文件: ${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hostApi.deleteFile(row.name).then((response) => {
            var serverData = response.data;
            if (serverData.code == 0) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message.error(`出错了，${serverData.msg}`);
            }
          });
        })
      },
      useFile(name) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        hostApi.debouncedUseFile(name, (response) => {
          loading.close();
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message.error(`出错了,请刷新页面，${serverData.msg}`);
          }
        });
      },
      addNewHostFile() {
        this.$router.push('createhostfile');
      }
    }
  }

</script>
