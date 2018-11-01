<template>
    <div class="socks-configure">
        <div class="main-content__title">Socks配置修改</div>
        <el-form label-width="100px">
            <el-form-item label="Socks解析">
                <textarea class="socks-editor" :placeholder="socksProxyExample"
                          v-model="$dc.profile.socksProxyNeedParseIp"></textarea>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import profileApi from '../../../api/profile';

    export default {
        name: 'configure',
        computed: {
            socksProxyExample() {
                return `#示例
0.0.0.0    # 任何80 443端口的请求经过socks5时都会被解析
4.4.4.4    # 没有0.0.0.0的情况下，socks5代理中只有4.4.4.4的80、443端口的请求被解析`
            }
        },
        methods: {
            async saveFile() {
                let response = await profileApi.saveFile(this.$dc.profile);
                let serverData = response.data;
                if (serverData.code == 0) {
                    this.$message({
                        showClose: true,
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

<style>
    .socks-configure {
        max-width: 500px;
        .el-button {
            margin-top: 15px;
            padding: 10px 28px;
            letter-spacing: 2px;
        }

        .socks-editor {
            height: 500px;
            width: 760px;
            font-size: 18px;
            padding: 10px 20px;
        }
    }

</style>
