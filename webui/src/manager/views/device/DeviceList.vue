<template>
    <div>
        <div class="main-content__title">绑定的设备列表</div>
        <div class="project-path-info">
            列表中的设备通过http trick发起请求时，请求会被当前用户的过滤器、规则处理。<br/>
            如果设备没有绑定任何用户则会使用root用户的过滤器、规则。<br/>
            扫描右边的二维码可绑定设备。
        </div>
        <div class="bind-qrcode-panel">
            <div class="title">扫码绑定设备</div>
            <div class="qrcode">
                <img class="bind-qrcode" :src="imgUrl">
            </div>
            <div class="bottom">
                <el-button type="text" @click="copyBindUrl">点击复制绑定链接</el-button>
            </div>
        </div>
        <el-table border align='center' style="width: 800px;" :data="bindedDeviceList">
            <el-table-column prop="id" label="ID" align="center" width="150" :sortable="true">
            </el-table-column>
            <el-table-column prop="name" label="Name" align="center" :sortable="true">
            </el-table-column>
            <el-table-column label="操作" :width="136" align="center" :context="_self">
                <template v-slot:default="scope">
                    <el-button type="danger" icon='el-icon-delete' size="mini"
                               @click='unbind(scope.row, scope.$index )'>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import qrcode from 'qrcode-js';
  import copyToClipboard from 'copy-to-clipboard';

  import profileApi from '../../../api/profile';
  import './devicelist.scss'

  export default {
    name: 'DeviceList',

    computed: {
      ...mapState(['bindedDeviceList', 'appInfo', 'userId']),
      bindUrl() {
        return `http://${this.appInfo.pcIp}:${this.appInfo.webUiPort}/profile/device/bind?userId=${this.userId}`;
      },
      imgUrl() {
        return qrcode.toDataURL(this.bindUrl, 4);
      }
    },
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
  };

</script>
