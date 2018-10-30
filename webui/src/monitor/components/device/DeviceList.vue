<template>
    <div class="device-list">
        <div class="title">绑定的设备</div>
        <div class="list-wrapper">
            <device v-for="(device, index) in $dc.bindedDeviceList" :device="device" :key="index"></device>
        </div>
        <div class="qr-code-wrapper">
            <div class="qr-code">
                <div class="title">扫码绑定设备</div>
                <div class="qrcode">
                    <img class="bind-qrcode" :src="imgUrl">
                </div>
                <div class="bottom">
                    <el-button type="text" @click="copyBindUrl">点击复制绑定链接</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import './devicelist.pcss';
    import Device from './Device.vue';
    import qrcode from 'qrcode-js';
    import copyToClipboard from 'copy-to-clipboard';
    import profileApi from '../../../api/profile';
    export default {
        name: "DeviceList",
        components: {Device},
        methods: {
            copyBindUrl() {
                copyToClipboard(this.bindUrl);
                this.$message('已将设备绑定链接复制到剪切板，在设备中打开此url即可绑定设备');
            },
            async unbind(row, index) {
                await profileApi.unBind(row.id);
                this.$message('解绑成功');
            }
        },
        computed: {
            bindUrl() {
                return `http://${this.$dc.appInfo.pcIp}:${this.$dc.appInfo.realUiPort}/profile/device/bind?userId=${this.$dc.userId}`;
            },
            imgUrl() {
                return qrcode.toDataURL(this.bindUrl, 4);
            }
        }
    }
</script>

