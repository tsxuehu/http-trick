<template>
    <div class="device-list">
        <div class="title">绑定的设备</div>
        <div class="list-wrapper">
            <device @right-clicked="rightClicked"
                    v-for="(device, index) in $dc.bindedDeviceList" :device="device" :key="index"></device>
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
        <context-menu id="testingctx" ref="ctx"
                      :ctxOpen="onCtxOpen"
                      :ctxCancel="resetCtxLocals"
                      :ctxClose="onCtxClose">
            <li class="ctx-item" @click="renameDevice">取别名</li>
            <li class="ctx-item" @click="changeHost">修改host</li>
            <li class="ctx-item" @click="removeDevice">删除设备</li>
            <li class="ctx-item" v-if="!$dc.rightClickDevice.disableMonitor" @click="disableMonitor">停止监控</li>
            <li class="ctx-item" v-if="$dc.rightClickDevice.disableMonitor" @click="enableMonitor">开启监控</li>
        </context-menu>
    </div>
</template>

<script>
    import './devicelist.pcss';
    import Device from './Device.vue';
    import ContextMenu from '../../../context-menu/index';
    import qrcode from 'qrcode-js';
    import copyToClipboard from 'copy-to-clipboard';
    import profileApi from '../../../api/profile';

    export default {
        name: "DeviceList",
        components: {Device, ContextMenu},
        methods: {
            copyBindUrl() {
                copyToClipboard(this.bindUrl);
                this.$message('已将设备绑定链接复制到剪切板，在设备中打开此url即可绑定设备');
            },
            // 修改设备host
            changeHost() {

            },
            async removeDevice(row, index) {
                await profileApi.unBind(row.id);
                this.$message('解绑成功');
            },
            renameDevice() {
                this.$prompt('请输入设备名字', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(async ({value}) => {
                    await profileApi.setDeviceName(this.$dc.rightClickDeviceId, value);
                    this.$message({
                        type: 'success',
                        message: '设备命名成功'
                    });
                }).catch(() => {

                });
            },
            removeDevice() {
                this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await profileApi.unBind(this.$dc.rightClickDeviceId);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                });
            },
            disableMonitor() {
                profileApi.disableMonitor(this.$dc.rightClickDeviceId);
            },
            enableMonitor() {
                profileApi.enableMonitor(this.$dc.rightClickDeviceId);
            },
            // -------------------------------右击菜单显示
            // 打开菜单
            onCtxOpen(deviceId) {
                this.$dc.setRightClickedDeviceId(deviceId);
            },
            rightClicked(event, deviceId) {
                this.$refs.ctx.open(event, deviceId)
            },
            // 点击菜单选项
            onCtxClose(locals) {
            },
            // 点击空白地方
            resetCtxLocals() {
                this.$dc.setRightClickedDeviceId('');
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

