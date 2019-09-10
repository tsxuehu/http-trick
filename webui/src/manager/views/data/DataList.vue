<template>
    <div>
        <div class="main-content__title">自定义数据文件列表</div>
        <div class="project-path-info">在http转发规则里面，可以配置将这里的mock数据返回给浏览器</div>
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6" :offset="18" class="addhost-btn-wrap">
                <el-button size="small" @click='requestAddDataFile()'>新增数据文件</el-button>
            </el-col>
        </el-row>
        <el-table border align='center' :data="dataList">
            <el-table-column prop="name" label="名字" align="center" width="300" :sortable="true">
            </el-table-column>
            <el-table-column prop="contenttype" label="类型" align="center">
            </el-table-column>
            <el-table-column label="操作" :width="136" align="center" :context="_self">
                <template v-slot:default="scope">
                    <el-button type="info" icon='el-icon-edit' size="mini"
                               @click='requestEditDataFile(scope.row)'>
                    </el-button>
                    <el-button type="danger" icon='el-icon-delete' size="mini"
                               @click='deleteDataFile(scope.row, scope.$index )'>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import * as DataCreateFormApi from '../../form-widget/data-create-form/index.js'
  import * as DataEditFormApi from '../../form-widget/data-edit-form/index.js'
  import dataApi from 'src/api/data';

  export default {
    name: 'mockdatalist',
    computed: {
      ...mapState(['dataList'])
    },
    methods: {
      requestAddDataFile() {
        DataCreateFormApi.setEventHandle({});
        DataCreateFormApi.create();
      },
      requestEditDataFile(dataEntry) {
        DataEditFormApi.edit(dataEntry);
      },

      deleteDataFile(dataEntry, index) {
        this.$confirm(`此操作将永久删除该数据文件: ${dataEntry.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let copyDataList = JSON.parse(JSON.stringify(this.dataList));
          copyDataList.splice(index, 1);
          let res = await dataApi.saveDataList(copyDataList);
          let serverData = res.data;
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
      }
    }
  }

</script>
