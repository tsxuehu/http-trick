<template>
    <div class="socks-configure">
        <div class="main-content__title">代理配置</div>
        <el-form label-width="200px">
            <el-form-item label="使用外部代理">
                <el-checkbox v-model="$dc.profile.externalHttpProxy">使用</el-checkbox>
            </el-form-item>
            <el-form-item label="External Http代理" v-if="$dc.profile.externalHttpProxy">
                <div class="http-proxy">
                    <el-input class="ip" v-model="$dc.profile.httpIp" placeholder="Ip"></el-input>
                    :
                    <el-input class="port" v-model="$dc.profile.httpPort" placeholder="端口"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="Socks代理域名">
                <textarea class="socks-editor" :placeholder="socksProxyExample"
                          v-model="$dc.profile.socksProxyDomain"></textarea>
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
*.youzan.com    # 所有有赞域名都会走socks5代理
carmen.youzan.com    # carmen.youzan.com走socks5代理`
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

        .http-proxy {
            width: 400px;
            .ip {
                width: 200px;
                display: inline-block;
                margin-right: 10px;
            }
            .port {
                width: 100px;
                margin-left: 10px;
                display: inline-block;
            }
        }

        .el-button {
            margin-top: 15px;
            padding: 10px 28px;
            letter-spacing: 2px;
        }

        .socks-editor {
            height: 200px;
            width: 760px;
            font-size: 18px;
            padding: 10px 20px;
        }
    }

</style>
