<template>
    <div>
        <div class='bread'>
            <strong>工程路径管理</strong>
        </div>
        <el-form label-width="100px" class="demo-ruleForm"
                 style="margin:20px;width:80%;min-width:800px;">
            <template v-for="(obj ,index) in $dc.profile.projectPath">
                <el-form-item :label="'工程'+(index+1)" :key="index">
                    <div style="padding-left: 5px">
                        <el-row :gutter="10">
                            <el-col :span="3" style="text-align: right">
                                工程名:
                            </el-col>
                            <el-col :span="10">
                                <el-input v-model="obj.key" placeholder="工程名"></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin-top: 5px;">
                            <el-col :span="3" style="text-align: right">
                                工程路径:
                            </el-col>
                            <el-col :span="18">
                                <el-input v-model="obj.value" placeholder="工程在本地的绝对路径"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="danger" icon='delete' size="mini"
                                           @click='deleteParam(obj,index,projectPathArray)'>
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button @click="addParam">增加工程路径设置</el-button>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import profileApi from '../../../api/profile';
    import forEach from 'lodash/forEach';
    export default {
        name: 'project-path',
        methods: {
            deleteParam(row, index, list) {
                this.$confirm('此操作不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$dc.profile.projectPath.splice(index, 1);
                });
            },
            async saveFile() {
                // 由host数组组装文件
                let response = await profileApi.saveFile(this.$dc.profile);
                let serverData = response.data;
                if (serverData.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                } else {
                    this.$message.error(`出错了，${serverData.msg}`);
                }
            },
            addParam() {
                this.$dc.profile.projectPath.push({
                    key: "",
                    value: ""
                });
            }
        }
    };

</script>
