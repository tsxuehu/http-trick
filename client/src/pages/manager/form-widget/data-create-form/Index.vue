<template>
    <!-- 新增自定义mock数据文件对话框 -->
    <el-dialog title="新建Mock数据文件" :visible.sync="visible">
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
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="addDataFile">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import dataApi from 'src/api/data';

  import uuidV4 from 'uuid/v4';

  export default {
    name: "DataCreateForm",
    components: {},
    data() {
      return {
        visible: false,
        addDataFileForm: {
          visible: false,
          id: '',
          name: '',
          contenttype: ''
        }
      }
    },
    methods: {
      setEventHandle({
                       onDataFileCreated
                     }) {
        this.onDataFileCreated = onDataFileCreated;
      },
      createDataFile() {
        this.visible = true;
      },
      async addDataFile() {
        this.visible = false;
        let id = uuidV4();
        let entry = {
          id: id,
          name: this.addDataFileForm.name,
          contenttype: this.addDataFileForm.contenttype
        };
        let res = await dataApi.createDataFile(entry);
        let serverData = res.data;
        if (serverData.code != 0) {
          this.$message.error(`出错了，${serverData.msg}`);
          return;
        }
        this.addDataFileForm.name = '';
        this.addDataFileForm.contenttype = '';
        if (this.onDataFileCreated) {
          this.onDataFileCreated(id)
        }
      }
    }
  }
</script>

