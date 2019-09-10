<template>
    <!-- 编辑数据文件对话框 -->
    <el-dialog
            ref="editDataFileDialog"
            title="编辑Mock数据文件"
            :close-on-press-escape="false"
            :visible.sync="visible">
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
            <el-button @click="visible = false">取 消</el-button>
            <el-button @click="toggleFullScreen">全屏</el-button>
            <el-button @click="formatEditor">格式化</el-button>
            <el-button type="primary" @click="finishEditDataFile">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import dataApi from 'src/api/data';

  import $ from 'jquery';
  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';

  import 'codemirror/addon/display/fullscreen';
  import 'codemirror/addon/display/fullscreen.css';

  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/htmlmixed/htmlmixed';

  let editor = null;

  import './index.scss'

  export default {
    name: "DataEditForm",
    data() {
      return {
        visible: false,
        editDataFileForm: {
          entry: {},
          content: ''
        }
      }
    },
    methods: {

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

      async requestEditDataFile(entry) {
        this.editDataFileForm.entry = entry;
        let response = await dataApi.getDataFile(entry.id);
        let serverData = response.data;
        if (serverData.code != 0) {
          this.$message.error(`出错了，${serverData.msg}`);
          return;
        }
        this.visible = true;

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
      },
      async finishEditDataFile() {
        let entry = this.editDataFileForm.entry;
        let response = await dataApi.saveDataFile(entry.id, editor.getValue());
        let serverData = response.data;
        if (serverData.code == 0) {
          this.editDataFileForm.entry = {};
          this.visible = false;
          editor.setValue('');
        } else {
          this.$message.error(`出错了，${serverData.msg}`);
        }
      },
      init() {
        // 强制dialog渲染body部分, 对ele dialog hack的初始化方式，原始的dialog不提供mouted后的事件
        // 编辑器editor初始化的时候需要用到editDataFileDialog里的元素content-editor
        this.$refs.editDataFileDialog.rendered = true;
      }
    }
  }
</script>

