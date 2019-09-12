<template>
    <div>
        <div class="main-content__title">规则集列表</div>
        <div class="project-path-info">http转发规则以规则集的方式组织，可以控制单个规则集是否启用。</div>
        <div class="rule-list-op">
            <div class="op">
                <el-button size="small" @click='importRemoteRule'>导入远程规则</el-button>
            </div>
            <div class="op">
                <el-button size="small" type="primary" @click='addRuleCollection'>新增规则集</el-button>
            </div>
        </div>

        <el-table border :data="ruleFileList" row-key="id">
            <el-table-column prop="name" label="名字" width="200">
                <template v-slot:default="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作" :width="230">
                <template v-slot:default="scope">
                    <div class="rule-file-op-container">
                        <el-button type="danger" icon='el-icon-delete' size="mini"
                                   @click='onDeleteFile(scope.row, scope.$index)'/>
                        <a :href="'#/editrule?id='+scope.row.id">
                            <el-button type="info" icon='el-icon-edit' size="mini">
                            </el-button>
                        </a>
                        <el-button type="info" icon='el-icon-download' size="mini"
                                   @click='onDownloadFile(scope.row, scope.$index)'/>
                        <span>
                            <el-button type="info" icon='el-icon-share' size="mini"
                                       @click='onShareFile(scope.row, scope.$index)'/>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="启用" width="100">
                <template v-slot:default="scope">
                    <el-switch
                            :value="scope.row.checked"
                            :disabled="!enableRule"
                            @input="onSelectionChange(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

  import copyToClipboard from 'copy-to-clipboard';
  import * as ruleApi from 'src/api/rule';
  import utilsApi from 'src/api/utils';
  import './file-list.scss';

  export default {
    name: 'rulefilelist',
    computed: {
      ...mapState(['ruleFileList', 'appInfo']),
      ...mapGetters(['enableRule'])
    },
    methods: {
      ...mapActions(['setFileCheckStatus']),
      onDeleteFile(row, index) {
        this.$confirm(`此操作将永久删除该文件: ${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ruleApi.deleteFile(row.id).then(response => {
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
        });
      },
      onDownloadFile(row, index) {
        if (!row.meta.remote) {
          window.location = '/rule/download?id=' + row.id;
        } else {
          this.$alert(row.meta.url, '规则URL', {
            confirmButtonText: 'OK',
            callback: action => {
            }
          });
        }
      },
      onSelectionChange(ruleFile) {

        this.setFileCheckStatus({
          ruleFileId: ruleFile.id,
          check: !ruleFile.checked
        })
      },

      onShareFile(row, index) {
        let url = `http://${this.appInfo.pcIp}:${this.appInfo.webUiPort}/rule/file/raw?id=${encodeURIComponent(row.id)}`;
        // 复制
        copyToClipboard(url);
        this.$message(`已复制规则${encodeURIComponent(row.name)}链接`);
      },
      // 导入远程文件
      async importRemoteRule() {
        let rulResult = await this.$prompt(
          '请输入远程规则文件的url',
          '导入远程规则',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        );
        let nameResult = await this.$prompt(
          '请输入到如规则的文件名',
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
        content.id = '';

        content.name = name;
        content.checked = false;
        // 导入
        // 查找引用的变量
        let varNameList = ruleApi.getReferenceVar(content);
        let infoStr;
        if (varNameList.length > 0) {
          infoStr = `导入规则文件名为${content.name},引用变量【${varNameList.join(
            '; '
          )}】请确保变量已经在转发路径变量中设置过`;
        } else {
          infoStr = `导入规则文件名为${content.name}`;
        }
        this.$alert(infoStr, '导入远程规则', {
          confirmButtonText: '确定',
          callback: action => {
            if (action == 'confirm') {
              // 创建文件
              ruleApi.saveRuleFile(content.id, content).then(response => {
                var serverData = response.data;
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
              });
            }
          }
        });
      },
      addRuleCollection() {
        this.$router.push('createrulefile');
      },
    }
  };
</script>
