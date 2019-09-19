<template>
    <div id="app" class="app">
        <div class="op-bar">
            <span class="icon-btn" :class="{'overflow':monitorState.overflow}"
                  @click="toggleRecordState">
                <i class="el-icon-video-pause zanting" v-if="!monitorState.stopRecord"></i>
                <i class="el-icon-video-play bofang" v-else></i>
            </span>
            <i class="iconfont icon-qingchu icon-btn" @click="clearMonitorData"></i>
            <span class="tips " :style="{visibility: monitorState.overflow? 'initial' : 'hidden'}">记录已满，请清除历史记录</span>
            <span class="filters">
                Filter:
                <input placeholder="Host" v-model="filterForm.host"/>
                /
                <input placeholder="Path" v-model="filterForm.path"/>
                <i class="iconfont icon-sousuo search"></i>
            </span>
            <div class="placeholder"></div>
            <a class="goto-manager" href="/index.html" target="_blank">
                <el-button type="text">管理</el-button>
            </a>
            <a href="javascript:void(0)" v-if="!appInfo.single" class="username">
                <el-button type="text">{{userInfo.userId}}</el-button>
            </a>
        </div>
        <div :style="{height: contentHeight+'px'}" class="monitor">
            <device-list></device-list>
            <http-traffic :height="contentHeight"></http-traffic>
            <detail></detail>
        </div>
    </div>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import debounce from 'lodash/debounce';
  import HttpTraffic from './components/traffic/HttpTraffic.vue';
  import Detail from './components/detail/Detail.vue';
  import DeviceList from './components/device/DeviceList.vue';
  import delay from 'delay';

  export default {
    components: {
      HttpTraffic, Detail, DeviceList
    },
    data() {
      return {
        width: 0,
        contentHeight: 0,
        filterForm: { // 过滤器
          host: '',
          path: ''
        }
      };
    },
    computed: {
      ...mapState([
        'monitorState', 'filter', 'appInfo', 'userInfo'
      ])
    },
    methods: {
      ...mapActions([
        'initStore', 'toggleRecordState', 'clearMonitorData', 'setFilter'
      ]),

      calcSize() {
        console.log("resize")
        this.width = window.innerWidth;
        this.contentHeight = window.innerHeight - 28;
      }

    },
    watch: {
      // 监听过滤器变化
      filterForm: {
        handler: debounce(function () {
          // 过滤
          this.setFilter(this.filterForm);
        }, 1000),
        deep: true
      },
      filter: {
        handler: function () {
          this.filterForm = JSON.parse(JSON.stringify(this.filter))
        },
        deep: true
      },
    },

    async mounted() {
      await delay(1000);
      this.filterForm = JSON.parse(JSON.stringify(this.filter))
    },
    async created() {
      this.initStore();
      this.calcSize();
      window.addEventListener("resize", debounce(_ => {
        this.calcSize();
      }, 200));
    }
  };
</script>

