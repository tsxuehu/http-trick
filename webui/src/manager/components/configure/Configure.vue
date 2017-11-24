<template>
    <div>
        <div class='bread'>
            <strong>基础配置修改</strong>
        </div>
        <el-form  label-width="250px" class="demo-ruleForm"
                 style="margin:20px;width:80%;min-width:800px;">
            <el-form-item label="代理端口">
                <el-input v-model="$dc.configure.proxyPort" placeholder="proxy的代理端口"></el-input>
            </el-form-item>
            <el-form-item label="超时时间">
                <el-input v-model="$dc.configure.requestTimeoutTime" placeholder="远程服务器响应超时，proxy会终止请求"></el-input>
            </el-form-item>
            <el-form-item label="gitlab token">
                <el-input v-model="$dc.configure.gitlabToken"
                          placeholder="请填写你在gitlab上的token (proxy访问gitlab上的文件需要token)"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import confApi from '../../../api/conf';
    import forEach from 'lodash/forEach';
    export default {
        name: 'configure',
        methods: {
            async saveFile() {
                this.$dc.configure.requestTimeoutTime = parseInt(this.$dc.configure.requestTimeoutTime);
                this.$dc.configure.proxyPort = parseInt(this.$dc.configure.proxyPort);
                let response = await confApi.saveFile(this.$dc.configure);
                let serverData = response.data;
                if (serverData.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                } else {
                    this.$message.error(`出错了，${serverData.msg}`);
                }
            }
        }
    };

</script>
