<template>
  <div class="main-wrapper">
    <!-- 顶部导航 -->
    <header class="head-nav">
      <el-row>
        <el-col :span="6" class="logo-container">
          <span>zanProxy</span>
        </el-col>
        <el-col :span="15">
          <div style="margin-top: 16px;">
            <el-dropdown menu-align="start" @command="selectHostFile">
              <el-button type="primary" size="small">
                Host切换<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template v-for="hostfile in hostFileList">
                  <el-dropdown-item :command="hostfile.name">
                    {{hostfile.name}}
                    <i class="el-icon-check" v-if="hostfile.checked"></i>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <span style="margin-left: 50px">
              <el-dropdown :hide-on-click="false" menu-align="start" @command="selectRuleFile">
                <el-button type="primary" size="small">
                  Rule设置<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="rulefile in ruleFileList">
                    <el-dropdown-item :command="rulefile.name + '-%-' + rulefile.checked" :disabled="!ruleState">
                      {{rulefile.name}}
                      <i class="el-icon-check" v-if="rulefile.checked"></i>
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
        </el-col>
        <el-col :span="3" class="monitor-wrap">

        </el-col>
      </el-row>
    </header>

    <!-- 正文 -->
    <div class="left-fixed-right-auto">
      <div class="left">
        <left-menu></left-menu>
      </div>
      <div class="right">
        <div class="main-content">
          <router-view></router-view>
        </div>
      </div>
    </div>


    <!-- 新增自定义mock数据文件对话框 -->
    <el-dialog title="新建数据文件" v-model="addDataFileForm.visible">
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
    <el-dialog title="编辑文件" ref="editDataFileDialog" :close-on-press-escape="false"
               v-model="editDataFileForm.visible">
      <span slot="title">
        编辑数据文件 {{editDataFileForm.entry.name}} [Content-Type: {{editDataFileForm.entry.contenttype}}]
      </span>
      <div id="content-editor-container" style="height: 305px;">
        <div id="content-editor">

        </div>
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
  import LeftMenu from './components/common/LeftMenu';
  import hostApi from '../api/host';
  import ruleApi from '../api/rule';
  import confApi from '../api/conf';
  import Vue from 'vue';
  import $ from 'jquery';
  import _ from 'lodash';
  import dataApi from '../api/data';
  import uuidV4  from 'uuid/v4';
  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';

  import  'codemirror/addon/display/fullscreen';
  import 'codemirror/addon/display/fullscreen.css';

  import  'codemirror/mode/javascript/javascript';
  import  'codemirror/mode/htmlmixed/htmlmixed';
  let editor = null;
  Vue.component(LeftMenu.name, LeftMenu);
  export default {
    name: 'app',
    data() {
      return {
        isDataCenter: true,
        // runtime信息
        runtime: {},
        // 基本配置信息
        conf: {},
        // conf中的参数设置
        projectPathArray: [],
        // 生效的host
        host: {},
        // 生效的globHost
        globhost: {},
        // 生效的规则
        rule: [],
        // host文件列表
        hostFileList: [],
        // rule文件列表
        ruleFileList: [],
        dataList: [],
        // 新增数据文件对话框使用数据
        addDataFileForm: {
          visible: false,
          callback: null,
          id: '',
          name: '',
          contenttype: ''
        },
        editDataFileForm: {
          visible: false,
          entry: {},
          content: '',
        }
      }
    },
    computed: {
      ruleState(){
        return this.conf.enableRule || false;
      }
    },
    methods: {
      selectHostFile(name){
        hostApi.debouncedUseFile(name, (response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message.error(`出错了,请刷新页面，${serverData.msg}`);
          }
        });
      },
      selectRuleFile(cmd){
        // panama-false
        var kv = cmd.split('-%-');
        ruleApi.setFileCheckStatus(kv[0], kv[1] == 'false').then((response) => {
          var serverData = response.data;
          if (serverData.code != 0) {
            this.$message.error(`出错了，${serverData.msg}`);
          }
        });
      },
      deleteDataFile (entry, index) {
        this.$confirm(`此操作将永久删除该数据文件: ${entry.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataList.splice(index, 1);
          dataApi.saveDataList(this.dataList).then((res) => {
            var serverData = res.data;
            if (serverData.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message.error(`出错了，${serverData.msg}`);
            }
          })
        })
      },
      requestAddDataFile (callback) {
        this.addDataFileForm.callback = callback;
        this.addDataFileForm.visible = true;
      },
      addDataFile(){
        this.addDataFileForm.visible = false;
        var id = uuidV4();
        this.dataList.push({
          id: id,
          name: this.addDataFileForm.name,
          contenttype: this.addDataFileForm.contenttype
        });
        dataApi.saveDataList(this.dataList).then((res) => {
          var serverData = res.data;
          if (serverData.code == 0) {
            this.$message({
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
        })
      },
      toggleFullScreen(){
        if (editor.getOption("fullScreen")) {
          // 一处父元素上的transform属性 chroem、firefox transform元素的子元素 fixed属性会变为absolute
          $("#content-editor").parents(".el-dialog").css("transform", "");
          //   document.getElementById('content-editor-container').appendChild(document.getElementById("content-editor"));
        } else {
          $("#content-editor").parents(".el-dialog").css("transform", "initial");
          //   document.body.appendChild(document.getElementById("content-editor"));
        }
        editor.setOption("fullScreen", !editor.getOption("fullScreen"));
        editor.focus();
      },
      closeFullScreen(){
        if (editor.getOption("fullScreen")) {
          editor.setOption("fullScreen", false);
          $("#content-editor").parents(".el-dialog").css("transform", "");
          // document.getElementById('content-editor-container').appendChild(document.getElementById("content-editor"));
          editor.focus();
        }
      },
      formatEditor(){
        // editDataFileForm.entry 可以获得 content的类型
        try {
          if (!(/json/i.test(this.editDataFileForm.entry.contenttype))) {
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
      requestEditDataFile(entry){
        this.editDataFileForm.entry = entry;
        dataApi.getDataFile(entry.id).then((response) => {
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
              window.editor = editor = new CodeMirror(document.getElementById("content-editor"), {
                value: serverData.data,
                mode: entry.contenttype,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
                extraKeys: {
                  "F11": _ => {
                    this.toggleFullScreen();
                  },
                  "Esc": _ => {
                    this.closeFullScreen();
                  }
                }
              });
            })
          }
        });
      },
      finishEditDataFile(){
        var entry = this.editDataFileForm.entry;
        dataApi.saveDataFile(entry.id, editor.getValue()).then((response) => {
          var serverData = response.data;
          if (serverData.code == 0) {
            this.$message({
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
      setRuleState(val) {
        if (val) {
          confApi.enableRule();
        } else {
          confApi.disableRule();
        }
      }
    },
    created() {
      if (!window.io) return;
      var socket = io('/manager');

      socket.on('conf', (data) => {
        this.conf = data;
        var projectPathArray = [];
        _.forEach(this.conf.projectPath, (value, key) => {
          projectPathArray.push({
            key: key,
            value: value
          })
        });
        this.projectPathArray = projectPathArray;
      });
      socket.on('hostfilelist', (data) => {
        this.hostFileList = data;
      });
      socket.on('rulefilelist', (data) => {
        this.ruleFileList = data;
      });
      socket.on('datalist', (data) => {
        this.dataList = data;
      });
    },
    mounted () {
      // 强制dialog渲染body部分, 对ele dialog hack的初始化方式，原始的dialog不提供mouted后的事件
      this.$refs.editDataFileDialog.rendered = true;
    }
  }

</script>
