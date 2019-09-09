<template>
    <div>
        <div class="main-content__title">规则集列表</div>
        <div class="project-path-info">http转发规则以规则集的方式组织，可以控制单个规则集是否启用。</div>
        <div class="rule-list-op">
            <div class="op">
                <input type="file" @change="fileUpload" class="importfile"/>
                <el-button size="small">导入规则集</el-button>
            </div>
            <div class="op">
                <el-button size="small" @click='importRemoteRule'>导入远程规则</el-button>
            </div>
            <div class="op">
                <el-button size="small" type="primary" @click='addRuleCollection'>新增规则集</el-button>
            </div>
        </div>

        <el-table border :data="$dc.ruleFileList">
            <el-table-column prop="name" label="名字" width="200">
                <template  v-slot:default="scope">
                    {{ scope.row.name }}
                    <el-tag type="danger" v-if="scope.row.meta.remote" close-transition>远程</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作" :width="230">
                <template v-slot:default="scope">
                    <div class="rule-file-op-container">
                        <el-button type="danger" icon='el-icon-delete' size="mini"
                                   @click='onDeleteFile(scope.row,scope.$index)'/>
                        <a :href="'#/editrule?name='+scope.row.name">
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
                            v-model="scope.row.checked"
                            :disabled="!$dc.ruleState"
                            @change="onSelectionChange(scope.row.name,scope.row.checked)"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import copyToClipboard from 'copy-to-clipboard';
  import ruleApi from '../../../api/rule';
  import utilsApi from '../../../api/utils';
  import find from 'lodash/find';
  import './file-list.pcss';

  export default {
    name: 'rulefilelist',
    methods: {
      onDeleteFile(row, index) {
        this.$confirm(`此操作将永久删除该文件: ${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ruleApi.deleteFile(row.name).then(response => {
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
          window.location = '/rule/download?name=' + row.name;
        } else {
          this.$alert(row.meta.url, '规则URL', {
            confirmButtonText: 'OK',
            callback: action => {
            }
          });
        }
      },
      onShareFile(row, index) {
        let url = `http://${this.$dc.appInfo.pcIp}:${this.$dc.appInfo.webUiPort}/rule/file/raw?name=${encodeURIComponent(row.name)}`;
        // 复制
        copyToClipboard(url);
        this.$message(`已复制规则${encodeURIComponent(row.name)}链接`);
      },
      // 导入远程文件
      async importRemoteRule() {
        let result = await this.$prompt(
          '请输入远程规则文件的url',
          '导入远程规则',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        );

        let url = result.value;
        console.log(url);
        let response = await utilsApi.getRemoteFile(url);

        let remoteFileResponse = response.data;
        let content = remoteFileResponse.data;
        content.meta = {
          remote: true,
          url: url,
        };
        content.name = content.name + '-remote';
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
              ruleApi.saveFile(content.name, content).then(response => {
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
      onSelectionChange(name, checked) {
        ruleApi.setFileCheckStatus(name, checked).then(response => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },
      addRuleCollection() {
        this.$router.push('createrulefile');
      },
      fileUpload(evt) {
        var _this = this;
        var files = evt.target.files;
        var file = files[0];
        if (!file || file.type.indexOf('json') < 0) return;

        var reader = new FileReader();
        reader.onload = function (e) {
          var contentStr = e.target.result;
          var content = JSON.parse(contentStr);
          content.checked = false;
          // 判断是否存在同名规则，如果存在不允许导入
          var finded = find(_this.fileList, file => {
            return file.name == content.name;
          });
          if (finded) {
            _this.$message.error(
              `已经存在名为${
                content.name
                }的规则，请修改规则文件里的name字段,以及文件名`
            );
            return;
          }
          // 查找引用的变量
          var varNameList = ruleApi.getReferenceVar(content);
          var infoStr;
          if (varNameList.length > 0) {
            infoStr = `导入规则文件名为${
              content.name
              },引用变量【${varNameList.join(
              '; '
            )}】请确保变量已经在转发路径变量里设置过值`;
          } else {
            infoStr = `导入规则文件名为${content.name}`;
          }
          _this.$alert(infoStr, '规则文件导入', {
            confirmButtonText: '确定',
            callback: action => {
              if (action == 'confirm') {
                // 创建文件
                ruleApi.saveFile(content.name, content).then(response => {
                  var serverData = response.data;
                  if (serverData.code == 0) {
                    // 判断创建成功还是失败
                    _this.$message({
                      showClose: true,
                      message: '恭喜你，导入成功',
                      type: 'success'
                    });
                  } else {
                    _this.$message.error(`出错了，${serverData.msg}`);
                  }
                });
              }
            }
          });
        };
        reader.readAsText(file);
      }
    }
  };
</script>
<style>
    .addrule-btn-wrap {
        text-align: right;
    }


</style>
