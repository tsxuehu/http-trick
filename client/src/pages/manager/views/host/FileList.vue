<template>
    <div class="host-view">
        <div class="main-content__title">Host 文件列表</div>
        <div class="project-path-info">只允许一个host文件生效。</div>
        <div class="host-list-op">
            <el-button size="small" @click='addNewHostFile'>新增 Host 文件</el-button>
            <el-button size="small" @click='importRemoteHostFile'>导入远程规则</el-button>
        </div>

        <el-table border align='center' :data="hostFileList" row-key="id">
            <el-table-column prop="name" label="名字" width="150">
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作" :width="180">
                <template v-slot:default="scope">
                    <div class="host-file-op-container">
                        <el-button
                                type="danger"
                                icon='el-icon-delete'
                                size="mini"
                                @click="onDeleteFile(scope.row)"
                        />
                        <a :href="'#/edithost?id='+scope.row.id">
                            <el-button type="info" icon='el-icon-edit' size="mini">
                            </el-button>
                        </a>
                        <span>
                            <el-button type="info" icon='el-icon-share' size="mini"
                                       @click='onShareFile(scope.row)'/>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="checked" label="启用" width="85">
                <template v-slot:default="scope">
                    <el-radio v-model="selectedFileId" :label="scope.row.id" :disabled="!enableHost"/>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import copyToClipboard from 'copy-to-clipboard';
  import * as hostApi from 'src/api/host'
  import find from 'lodash/find'
  import './file-list.scss'
  import utilsApi from 'src/api/utils';

  export default {
    name: 'hostlist',

    computed: {
      ...mapState(['hostFileList', 'appInfo']),
      ...mapGetters(['enableHost']),
      selectedFileId: {
        get() {
          // 遍历找出选择的文件
          var selectedFile = find(this.hostFileList, (file) => {
            return file.checked;
          });
          return selectedFile ? selectedFile.id : '';
        },
        set(value) {
          this.useFile(value);
        }
      }
    },
    methods: {
      onDeleteFile(row) {
        this.$confirm(`此操作将永久删除该文件: ${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hostApi.deleteFile(row.id).then((response) => {
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
      async useFile(id) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let response = await hostApi.useFile(id);
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
      },
      addNewHostFile() {
        this.$router.push('createhostfile');
      },

      onShareFile(row, index) {
        let url = `http://${this.appInfo.pcIp}:${this.appInfo.webUiPort}/host/file/raw?id=${encodeURIComponent(row.id)}`;
        // 复制
        copyToClipboard(url);
        this.$message(`已复制Host ${encodeURIComponent(row.name)}链接`);
      },

      async importRemoteHostFile() {
        let rulResult = await this.$prompt(
          '请输入远程Host文件的url',
          '导入远程规则',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        );
        let nameResult = await this.$prompt(
          '请输入导入Host的文件名',
          '导入远程规则',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        );
        let url = rulResult.value;
        let name = nameResult.value;

        let response = await utilsApi.getRemoteFile(url);

        let remoteFileResponse = response.data;
        let content = remoteFileResponse.data;
        content.meta = {
          remote: true,
          url: url,
        };
        content.name = name;
        content.checked = false;

        let saveRes = await hostApi.saveFile('', content);

        var serverData = saveRes.data;
        if (serverData.code == 0) {
          // 判断创建成功还是失败
          this.$message({
            showClose: true,
            message: '恭喜你，导入成功',
            type: 'success'
          });
        } else {
          this.$message.error(`出错了，${serverData.msg}`);
        }
      },
    }
  }

</script>
