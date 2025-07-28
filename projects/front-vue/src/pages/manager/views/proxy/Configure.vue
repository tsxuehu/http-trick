<template>
    <div class="socks-configure">
        <div class="main-content__title">代理配置</div>
        <el-form label-width="200px">
            <el-form-item label="使用外部代理">
                <el-checkbox v-model="profileEditForm.externalProxy">使用</el-checkbox>
            </el-form-item>
            <el-form-item label="外部代理类型" v-if="profileEditForm.externalProxy">
                <el-radio-group v-model="socks5Proxy">
                    <el-radio :label="true">Socks5代理</el-radio>
                    <el-radio :label="false">Http代理</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="External Http代理" v-if="profileEditForm.externalProxy && !socks5Proxy">
                <div class="http-proxy">
                    <el-input class="ip" v-model="profileEditForm.httpProxyIp" placeholder="Http Proxy Ip"></el-input>
                    :
                    <el-input class="port" v-model="profileEditForm.httpProxyPort"
                              placeholder="http Proxy port"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="External Socks代理" v-if="profileEditForm.externalProxy && socks5Proxy">
                <div class="http-proxy">
                    <el-input class="ip" v-model="profileEditForm.socks5ProxyIp"
                              placeholder="Socks5 Proxy Ip"></el-input>
                    :
                    <el-input class="port" v-model="profileEditForm.socks5ProxyPort"
                              placeholder="socks5 Proxy port"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="需要Http解析代理的域名">
                <textarea class="socks-editor" :placeholder="socksProxyExample"
                          v-model="profileEditForm.goThroughProxyConfig"></textarea>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveFile">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import profileApi from 'src/api/profile';
  import './configure.scss'

  export default {
    name: 'configure',
    data() {
      return {
        profileEditForm: {}
      }
    },

    computed: {
      ...mapState(['profile']),
      socksProxyExample() {
        return `#示例
all               # 有all 配置项，所有域名君走http解析代理
*.domain.com      # 所有domain域名都会走Http解析代理
www.domain.com    # www.domain.com走Http解析代理`
      },
      socks5Proxy: {
        get: function () {
          return this.profileEditForm.externalSocks5Proxy;
        },
        set: function (v) {
          let profileEditForm = this.profileEditForm;
          if (v) {
            profileEditForm.externalSocks5Proxy = true;
            profileEditForm.externalHttpProxy = false;
          } else {
            profileEditForm.externalSocks5Proxy = false;
            profileEditForm.externalHttpProxy = true;
          }
        }
      }
    },
    watch: {
      profile(value) {
        this.profileEditForm = JSON.parse(JSON.stringify(value));
      }
    },
    methods: {
      async saveFile() {
        let response = await profileApi.saveFile(this.profileEditForm);
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
    },
    mounted() {
      this.profileEditForm = JSON.parse(JSON.stringify(this.profile));
    }
  };
</script>
