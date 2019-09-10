<template>
    <div class="view-configure">
        <div class="main-content__title">基础配置修改</div>
        <el-form label-width="200px">
            <el-form-item label="是否开启Http代理">
                <el-checkbox v-model="$dc.configure.startHttpProxy">开启</el-checkbox>
            </el-form-item>
            <el-form-item label="是否开启Socks5代理">
                <el-checkbox v-model="$dc.configure.startSocks5">开启</el-checkbox>
            </el-form-item>
            <el-form-item label="是否开启DNS服务">
                <el-checkbox v-model="$dc.configure.startDns">开启</el-checkbox>
            </el-form-item>
            <el-form-item label="是否开启专业版">
                <el-checkbox v-model="$dc.configure.professionalVersion">开启</el-checkbox>
            </el-form-item>
            <el-form-item label="Http代理端口">
                <el-input
                        v-model="$dc.configure.httpProxyPort"
                        placeholder="http代理端口"
                />
            </el-form-item>
            <el-form-item label="Socks5端口">
                <el-input
                        v-model="$dc.configure.socks5ProxyPort"
                        placeholder="socks5代理端口"
                />
            </el-form-item>
            <el-form-item label="WebUi端口">
                <el-input
                        v-model="$dc.configure.webUiPort"
                        placeholder="WebUi端口"
                />
            </el-form-item>
            <el-form-item label="DNS端口">
                <el-input
                        v-model="$dc.configure.dnsPort"
                        placeholder="DNS端口"
                />
            </el-form-item>
            <el-form-item label="超时时间">
                <el-input
                        v-model="$dc.configure.requestTimeoutTime"
                        placeholder="远程服务器响应超时，proxy会终止请求"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import confApi from '../../../api/conf';
  import './configure.scss'

  export default {
    name: 'configure',
    computed: {

    },
    methods: {
      async saveFile() {
        this.$dc.configure.requestTimeoutTime = parseInt(
          this.$dc.configure.requestTimeoutTime
        );
        this.$dc.configure.proxyPort = parseInt(this.$dc.configure.proxyPort);
        this.$dc.configure.socks5Port = parseInt(this.$dc.configure.socks5Port);
        let response = await confApi.saveFile(this.$dc.configure);
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
