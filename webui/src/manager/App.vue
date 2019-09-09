<template>
    <div class="main-wrapper">
        <el-container>
            <el-aside width="200px">
                <left-menu/>
            </el-aside>
            <el-container>
                <el-header height="72px">
                    <manager-header></manager-header>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

        <!-- 新增自定义mock数据文件对话框 -->
        <el-dialog title="新建Mock数据文件" :visible.sync="addDataFileForm.visible">
            <el-form :model="addDataFileForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="addDataFileForm.name"></el-input>
                </el-form-item>
                <el-form-item label="格式">
                    <el-select v-model="addDataFileForm.contenttype" placeholder="请选择数据文件格式">
                        <el-option label="html" value="text/html"></el-option>
                        <el-option label="json" value="application/json"></el-option>
                        <el-option label="javascript" value="application/javascript"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDataFileForm.visible = false">取 消</el-button>
                <el-button type="primary" @click="addDataFile">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑数据文件对话框 -->
        <el-dialog
                ref="editDataFileDialog"
                title="编辑Mock数据文件"
                :close-on-press-escape="false"
                :visible.sync="editDataFileForm.visible">
            <span slot="title">
                编辑数据文件 {{editDataFileForm.entry.name}} [Content-Type: {{editDataFileForm.entry.contenttype}}]
            </span>
            <div id="content-editor-container" style="height: 305px;">
                <div id="content-editor"></div>
            </div>
            <div>
                Press <strong>F11</strong> when cursor is in the editor to
                toggle full screen editing. <strong>Esc</strong> can also be used
                to <i>exit</i> full screen editing.
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDataFileForm.visible = false">取 消</el-button>
                <el-button @click="toggleFullScreen">全屏</el-button>
                <el-button @click="formatEditor">格式化</el-button>
                <el-button type="primary" @click="finishEditDataFile">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import LeftMenu from './components/LeftMenu';
  import Header from './components/Header.vue';
  import * as RuleEditForm from './form-widget/rule-edit-form/index'

  import hostApi from '../api/host';
  import ruleApi from '../api/rule';
  import profileApi from '../api/profile';
  import $ from 'jquery';
  import forEach from 'lodash/forEach';
  import dataApi from '../api/data';
  import uuidV4 from 'uuid/v4';
  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';

  import 'codemirror/addon/display/fullscreen';
  import 'codemirror/addon/display/fullscreen.css';

  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/htmlmixed/htmlmixed';


  let editor = null;

  export default {
    name: 'app',
    components: {
      [LeftMenu.name]: LeftMenu,
      [Header.name]: Header,
    },
    data() {
      return {
        isDataCenter: true,
        // 运行用户
        userId: 'guest',
        // 运行时信息
        appInfo: {},
        // 基本配置信息
        configure: {},
        // 个人配置
        profile: {
          projectPath: [],
          enableRule: false
        },
        // 将工程路径配置转换为数组格式 方便编辑
        redirectPathVariableArray: [],
        // 关联的ip
        bindedDeviceList: [],
        // 生效的规则
        rule: [],
        // host文件列表
        hostFileList: [],
        // rule文件列表
        ruleFileList: [],
        filters: [],
        dataList: [],
        // 新增数据文件对话框使用数据
        addDataFileForm: {
          visible: false,
          callback: null,
          id: '',
          name: '',
          contenttype: ''
        },
        // 编辑数据文件对话框
        editDataFileForm: {
          visible: false,
          entry: {},
          content: ''
        }
      };
    },
    computed: {
      ruleState() {
        return this.profile.enableRule || false;
      },
      hostState() {
        return this.profile.enableHost || false;
      },
      filterState() {
        return this.profile.enableFilter || false;
      }
    },
    methods: {
      async switchHost(value) {
        if (this.profile.enableHost) {
          await profileApi.disableHost();
        } else {
          await profileApi.enableHost();
        }
      },

      async selectHostFile(command) {
        let name = command;
        hostApi.debouncedUseFile(name, response => {
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

      async switchFilter(value) {
        if (this.profile.enableFilter) {
          profileApi.disableFilter();
        } else {
          profileApi.enableFilter();
        }
      },

      async switchRule(value) {
        if (this.profile.enableRule) {
          profileApi.disableRule();
        } else {
          profileApi.enableRule();
        }
      },

      selectRuleFile(command) {
        // panama-false
        let kv = command.split('-%-');
        ruleApi.setFileCheckStatus(kv[0], kv[1] == 'false').then(response => {
          var serverData = response.data;
          if (serverData.code != 0) {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },

      deleteDataFile(entry, index) {
        this.$confirm(`此操作将永久删除该数据文件: ${entry.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataList.splice(index, 1);
          dataApi.saveDataList(this.dataList).then(res => {
            var serverData = res.data;
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

      requestAddDataFile(callback) {
        this.addDataFileForm.callback = callback;
        this.addDataFileForm.visible = true;
      },

      addDataFile() {
        this.addDataFileForm.visible = false;
        var id = uuidV4();
        this.dataList.push({
          id: id,
          name: this.addDataFileForm.name,
          contenttype: this.addDataFileForm.contenttype
        });
        dataApi.saveDataList(this.dataList).then(res => {
          var serverData = res.data;
          if (serverData.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '新建成功!'
            });
            this.addDataFileForm.name = '';
            this.addDataFileForm.contenttype = '';
            this.addDataFileForm.callback && this.addDataFileForm.callback(id);
            this.addDataFileForm.callback = null;
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },

      toggleFullScreen() {
        if (editor.getOption('fullScreen')) {
          // 移除父元素上的transform属性 chrome、firefox transform元素的子元素 fixed属性会变为absolute
          $('#content-editor')
            .parents('.el-dialog')
            .css('transform', '');
          //   document.getElementById('content-editor-container').appendChild(document.getElementById("content-editor"));
        } else {
          $('#content-editor')
            .parents('.el-dialog')
            .css('transform', 'initial');
          //   document.body.appendChild(document.getElementById("content-editor"));
        }
        editor.setOption('fullScreen', !editor.getOption('fullScreen'));
        editor.focus();
      },

      closeFullScreen() {
        if (editor.getOption('fullScreen')) {
          editor.setOption('fullScreen', false);
          $('#content-editor')
            .parents('.el-dialog')
            .css('transform', '');
          // document.getElementById('content-editor-container').appendChild(document.getElementById("content-editor"));
          editor.focus();
        }
      },

      formatEditor() {
        // editDataFileForm.entry 可以获得 content的类型
        try {
          if (!/json/i.test(this.editDataFileForm.entry.contenttype)) {
            return;
          }
          let content = editor.getValue();
          let formated = JSON.stringify(JSON.parse(content), null, 4);
          editor.setValue(formated);
          editor.refresh();
          editor.focus();
        } catch (e) {
        }
      },

      requestEditDataFile(entry) {
        this.editDataFileForm.entry = entry;
        dataApi.getDataFile(entry.id).then(response => {
          var serverData = response.data;
          if (serverData.code != 0) {
            this.$message.error(`出错了，${serverData.msg}`);
            return;
          }
          this.editDataFileForm.visible = true;
          if (editor) {
            editor.setValue(serverData.data);
            editor.setOption('mode', entry.contenttype);
            this.$nextTick(() => {
              editor.refresh();
              editor.focus();
            });
          } else {
            this.$nextTick(() => {
              window.$ = $;
              window.editor = editor = new CodeMirror(
                document.getElementById('content-editor'),
                {
                  value: serverData.data,
                  mode: entry.contenttype,
                  lineNumbers: true,
                  matchBrackets: true,
                  autofocus: true,
                  extraKeys: {
                    F11: _ => {
                      this.toggleFullScreen();
                    },
                    Esc: _ => {
                      this.closeFullScreen();
                    }
                  }
                }
              );
            });
          }
        });
      },
      finishEditDataFile() {
        var entry = this.editDataFileForm.entry;
        dataApi.saveDataFile(entry.id, editor.getValue()).then(response => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功!'
            });
            this.editDataFileForm.entry = {};
            this.editDataFileForm.visible = false;
            editor.setValue('');
          } else {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },
    },

    async created() {
      // 获取用户id
      let result = await profileApi.getUserId();
      this.userId = result.data.data.userId;

      if (!window.io) return;
      let socket = io('/manager');

      socket.on('configure', data => {
        this.configure = data;
      });

      socket.on('appinfo', data => {
        this.appInfo = data;
      });

      socket.on('profile', profile => {
        this.profile = profile;
        let result = [];
        forEach(profile.redirectPathVariables, (value, key) => {
          result.push({
            key,
            value
          });
        });
        this.redirectPathVariableArray = result;
      });

      socket.on('bindedDeviceList', deviceList => {
        this.bindedDeviceList = deviceList;
      });

      socket.on('hostfilelist', data => {
        this.hostFileList = data;
      });

      socket.on('rulefilelist', data => {
        this.ruleFileList = data;
      });

      socket.on('filters', data => {
        this.filters = data;
      });

      socket.on('datalist', data => {
        this.dataList = data;
      });
    },

    mounted() {
      // 强制dialog渲染body部分, 对ele dialog hack的初始化方式，原始的dialog不提供mouted后的事件
      // 编辑器editor初始化的时候需要用到editDataFileDialog里的元素content-editor
      this.$refs.editDataFileDialog.rendered = true;
      RuleEditForm.init({
        dataList: this.dataList,
        userId: this.userId
      });
    }
  };
</script>
