<template>
    <div class="install-body">
        <h1>Http Trick</h1>
        <h2 id="toc_0">一、说明</h2>

        <p>http trick是http协议代理工具，需要设置浏览器代理或者系统代理才能使用本工具。</p>
        <p>PAC: {{pacUrl}}</p>

        <h2 id="toc_1">二、chrome 代理插件安装(用于设置浏览器代理)</h2>

        <p>推荐安装 SwitchyOmega <a
                href="https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif?hl=en-US"
                target="_blank">点击安装代理插件</a></p>

        <h4 id="toc_2">插件使用说明</h4>

        <ol>
            <li>安装完插件后请设置插件代理地址为<code>127.0.0.1</code>，代理协议: http，端口为<code>http trick</code>代理端口(默认8001)。</li>
            <li>如不清楚如何配置 SwitchyOmega，请参考 <a href="/help/chrome/" target="_blank">chrome 代理设置指南</a></li>
        </ol>

        <h2 id="toc_3">三、证书安装</h2>

        <h4 id="toc_4">1. 为什么需要安装证书</h4>

        <p>由于<code>http trick</code>会代理 https 的请求，所以需要本地安装<code>http trick</code>的https 证书。</p>

        <h4 id="toc_5">2. 证书下载</h4>

        <ol>
            <li>mac 系统请<a :href="url">点击下载到本地安装</a></li>
            <li>手机请扫码安装证书<img class="install-body__qrcode" :src="imgUrl"></li>
            <li>证书信任请参考<a href="/help/cert/" target="_blank">如何信任证书</a></li>
        </ol>
    </div>

</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
  import qrcode from 'qrcode-js';

  import './install.scss'
  export default {
    name: 'help-info',
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'appInfo', 'userId'
      ]),
      url() {
        let certUrl =
          'http://' +
          this.appInfo.pcIp +
          ':' +
          this.appInfo.webUiPort +
          '/utils/rootCA.crt';
        return certUrl;
      },
      imgUrl() {
        let certUrl =
          'http://' +
          this.appInfo.pcIp +
          ':' +
          this.appInfo.webUiPort +
          '/utils/rootCA.crt';
        return qrcode.toDataURL(certUrl, 4);
      },
      pacUrl() {
        return `http://${this.appInfo.pcIp}:${this.appInfo.webUiPort}/profile/${this.userId}/proxy.pac`
      }
    }
  };
</script>

