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
            <li class="ctx-item" @click="configGateway">设置网关</li>
            <li class="ctx-item" @click="configExternalProxy">设置外部代理</li>
            <li class="ctx-item" @click="removeDevice">删除设备</li>
            <li class="ctx-item" v-if="!$dc.rightClickDevice.disableMonitor" @click="disableMonitor">停止监控</li>
            <li class="ctx-item" v-if="$dc.rightClickDevice.disableMonitor" @click="enableMonitor">开启监控</li>
        </context-menu>
        <el-dialog
                :title="chooseHostTitle"
                :visible.sync="showChoseHostFile"
                width="30%"
                center>
            <div class="hostfile-list">
                <div v-for="(hostfile, index) in $dc.hostFileList"
                     :key="hostfile.name" @click="useHost(hostfile.name)">
                    <el-tag :class="{'used-host': hostfile.name == $dc.rightClickDevice.hostFileName}">
                        {{hostfile.name}}
                    </el-tag>
                </div>
                <div class="fake-tag"></div>
                <div class="fake-tag"></div>
                <div class="fake-tag"></div>
            </div>
        </el-dialog>
        <el-dialog
                :title="setGatewayTitle"
                :visible.sync="showSetGateway"
                width="30%"
                center>
            <div class="gateway">
                <el-form label-width="100px" :model="gateWayConfig">
                    <el-form-item label="选择机器">
                        <el-select v-model="gateWayConfig.ip" filterable placeholder="请选择机器">
                            <el-option
                                    v-for="item in machineList"
                                    :key="item.ip"
                                    :label="item.hostname"
                                    :value="item.ip">
                                <div style="width: 300px;">
                                    <span style="float: left">{{ item.hostname }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ip }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="机器IP">
                        <el-input v-model="gateWayConfig.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="gateWayConfig.port"></el-input>
                    </el-form-item>
                    <el-form-item label="目录">
                        <el-input v-model="gateWayConfig.who"></el-input>
                    </el-form-item>
                    <el-form-item label="SC">
                        <el-input v-model="gateWayConfig.sc"></el-input>
                    </el-form-item>
                    <el-form-item label="卡门">
                        <el-select v-model="gateWayConfig.carmen_ip" placeholder="请选择卡门">
                            <el-option
                                    v-for="item in carmenList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="卡门端口">
                        <el-input v-model="gateWayConfig.carmen_port"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitGatewayConfig()">提交</el-button>
                        <el-button @click="resetGatewayConfig()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <el-dialog
                :title="setExternalProxyTitle"
                :visible.sync="showSetExternalProxy"
                width="30%"
                center>
            <div class="gateway">
                <el-form label-width="100px" :model="currentProxy">
                    <el-form-item label="使用用户设置">
                        <el-checkbox v-model="currentProxy.canUseUserSetting">允许</el-checkbox>
                    </el-form-item>
                    <el-form-item label="代理">
                        <el-checkbox v-model="currentProxy.enable">开启</el-checkbox>
                    </el-form-item>
                    <el-form-item label="代理类型">
                        <el-radio-group v-model="currentProxy.type">
                            <el-radio label="socks5">Socks5代理</el-radio>
                            <el-radio label="http">Http代理</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="IP">
                        <el-input v-model="currentProxy.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="currentProxy.port"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitExternalProxy">提交</el-button>
                        <el-button @click="resetExternalProxy">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import './devicelist.pcss';
    import Device from './Device.vue';
    import ContextMenu from '../../../context-menu/index';
    import qrcode from 'qrcode-js';
    import copyToClipboard from 'copy-to-clipboard';
    import profileApi from '../../../api/profile';
    import utilsApi from '../../../api/utils';

    export default {
        name: "DeviceList",
        components: {Device, ContextMenu},
        data() {
            return {
                machineList: [],
                carmenList: [
                    {label: 'carmen-daily', value: '10.98.0.153', port: 7001},
                    {label: 'carmen-pre', value: '10.9.183.89', port: 7001},
                    {label: 'carmen-qa', value: '10.9.42.160', port: 7001},
                ],
                showChoseHostFile: false,
                showSetGateway: false,
                showSetExternalProxy: false,
                gateWayConfig: {
                    "ip": "",
                    "port": '80',
                    "who": "",
                    "sc": "",
                    "carmen_ip": "10.9.183.89",
                    "carmen_port": "7001"
                },
                currentProxy: {
                    canUseUserSetting: false,
                    enable: false,
                    type: 'http',
                    ip: '',
                    port: ''
                }
            }
        },
        computed: {
            bindUrl() {
                return `http://${this.$dc.appInfo.pcIp}:${this.$dc.appInfo.webUiPort}/profile/device/bind?userId=${this.$dc.userInfo.userId}`;
            },
            imgUrl() {
                return qrcode.toDataURL(this.bindUrl, 4);
            },
            chooseHostTitle() {
                return `选择${this.$dc.rightClickDevice.name}使用的Host文件`;
            },
            setGatewayTitle() {
                return `设置${this.$dc.rightClickDevice.name}的网关信息`;
            },
            setExternalProxyTitle() {
                return `设置${this.$dc.rightClickDevice.name}的外部代理`;
            }
        },
        methods: {
            copyBindUrl() {
                copyToClipboard(this.bindUrl);
                this.$message('已将设备绑定链接复制到剪切板，在设备中打开此url即可绑定设备');
            },
            // 修改设备host
            changeHost() {
                this.showChoseHostFile = true;
            },
            async configGateway() {
                // 等待
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let config = (await utilsApi.getConfigInfo(this.$dc.rightClickDeviceId)).data.data;
                this.gateWayConfig = {
                    "ip": config.machine.ip,
                    "port": config.machine.port,
                    "who": config.machine.who,
                    "sc": config.sc,
                    "carmen_ip": config.carmen.ip,
                    "carmen_port": config.carmen.port
                };
                loading.close();
                this.showSetGateway = true;
            },

            async submitGatewayConfig() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                await utilsApi.setGateWay(this.$dc.rightClickDeviceId, this.gateWayConfig);
                loading.close();
                this.showSetGateway = false;
            },
            resetGatewayConfig() {
                this.gateWayConfig = {
                    "ip": "",
                    "port": '80',
                    "who": "",
                    "sc": "",
                    "carmen_ip": "10.9.183.89",
                    "carmen_port": "7001"
                }
            },
            async useHost(hostFileName) {
                this.showChoseHostFile = false;
                let actual = hostFileName == this.$dc.rightClickDevice.hostFileName ? '' : hostFileName
                await profileApi.deviceUseHost(this.$dc.rightClickDeviceId, actual);
                this.$message({
                    type: 'success',
                    message: actual ? '设置Host成功' : '取消Host成功'
                });
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
            configExternalProxy() {
                this.resetExternalProxy();
                // 打开对话框
                this.showSetExternalProxy = true;
            },
            resetExternalProxy() {
                let device = this.$dc.rightClickDevice;
                let canUseUserSetting = device.externalProxyCanUseUserSetting;
                let enable = false;
                let type = 'socks5';
                let ip = '';
                let port = '';

                if (device) {
                    enable = device.externalProxy;
                    type = device.externalSocks5Proxy ? 'socks5' : 'http';
                    if (device.externalSocks5Proxy) {
                        ip = device.socks5Ip;
                        port = device.socks5Port;
                    } else {
                        ip = device.httpIp;
                        port = device.httpPort;
                    }
                }
                this.currentProxy = {canUseUserSetting, enable, type, ip, port};
            },
            async submitExternalProxy() {
                profileApi.setExternalProxy(this.$dc.rightClickDeviceId, this.currentProxy);
                this.showSetExternalProxy = false;
                this.$message('解绑成功');
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
        async created() {
            let machineRes = (await utilsApi.getGatewayMachine()).data;
            this.machineList = machineRes.servers;
        }
    }
</script>

