<template>
    <div class="device"
         @contextmenu.prevent="rightClicked($event, device.id)">
        <div class="name" key="name">Name: {{device.name}}<span v-if="currentDeviceId == device.id"
                                                                style="color: #eab700">(本机)</span></div>
        <div class="host" v-if="device.hostFileName" key="host">HOST: {{device.hostFileName}}</div>
        <div class="id" key="id">ID: {{device.id}}</div>
        <div class="status offline" v-if="device.disableMonitor"></div>
        <div class="status online" v-if="!device.disableMonitor"></div>
        <div class="id" v-if="proxy">代理:{{proxy}}</div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

  import './device.scss'

  export default {
    name: "Device",
    props: ["device"],
    computed: {
      ...mapGetters(['currentDeviceId']),
      proxy() {
        let device = this.device;

        let proxy = device.externalProxy;

        let type = device.externalSocks5Proxy ? 'socks5' : 'http';
        let ip = '';
        let port = '';
        let allowUseUserSetting = device.externalProxyCanUseUserSetting;

        if (device.externalSocks5Proxy) {
          ip = device.socks5Ip;
          port = device.socks5Port;
        } else {
          ip = device.httpIp;
          port = device.httpPort;
        }

        if (!proxy && !allowUseUserSetting) {
          return false;
        } else if (proxy) {
          return `${type}://${ip}:${port}`;
        } else {
          return '使用用户设置';
        }
      }
    },
    methods: {
      requestRemoveDevice() {

      },
      requestSetName() {

      },
      setName(deviceId, name) {

      },
      rightClicked(event, recordId) {
        this.$emit('right-clicked', event, recordId);
      }
    }
  }
</script>
