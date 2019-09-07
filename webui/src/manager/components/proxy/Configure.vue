<template>
    <div class="socks-configure">
        <div class="main-content__title">代理配置</div>
        <el-form label-width="200px">
            <el-form-item label="使用外部代理">
                <el-checkbox v-model="$dc.profile.externalProxy">使用</el-checkbox>
            </el-form-item>
            <el-form-item label="外部代理类型"  v-if="$dc.profile.externalProxy">
                <el-radio-group v-model="socks5Proxy">
                    <el-radio :label="true">Socks5代理</el-radio>
                    <el-radio :label="false">Http代理</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="External Http代理" v-if="$dc.profile.externalProxy && !socks5Proxy">
                <div class="http-proxy">
                    <el-input class="ip" v-model="$dc.profile.httpProxyIp" placeholder="Http Proxy Ip"></el-input>
                    :
                    <el-input class="port" v-model="$dc.profile.httpProxyPort" placeholder="http Proxy port"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="External Socks代理" v-if="$dc.profile.externalProxy && socks5Proxy">
                <div class="http-proxy">
                    <el-input class="ip" v-model="$dc.profile.socks5ProxyIp" placeholder="Socks5 Proxy Ip"></el-input>
                    :
                    <el-input class="port" v-model="$dc.profile.socks5ProxyPort" placeholder="socks5 Proxy port"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="需要Http解析代理的域名">
                <textarea class="socks-editor" :placeholder="socksProxyExample"
                          v-model="$dc.profile.goThroughProxyConfig"></textarea>
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
all               # 有all 配置项，所有域名君走http解析代理
*.domain.com      # 所有domain域名都会走Http解析代理
www.domain.com    # www.domain.com走Http解析代理`
            },
            socks5Proxy : {
                get: function () {
                    return this.$dc.profile.externalSocks5Proxy;
                },
                set: function (v) {
                    if (v) {
                        this.$dc.profile.externalSocks5Proxy = true;
                        this.$dc.profile.externalHttpProxy = false;
                    } else {
                        this.$dc.profile.externalSocks5Proxy = false;
                        this.$dc.profile.externalHttpProxy = true;
                    }
                }
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
                width: 150px;
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
