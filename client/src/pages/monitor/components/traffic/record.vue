<template>
    <div @click="clickRow(id)"
         :class="{'selected': selectRecordId == id, 'right-clicked':rightClickRecordId == id}"
         @contextmenu.prevent="rightClicked($event, id)"
         class="record row">
        <div class="cell cell-index">{{index+1}}</div>
        <div class="cell cell-status">{{status}}</div>
        <div class="cell cell-method">{{method}}</div>
        <div class="cell cell-protocol">{{protocol}}</div>
        <div class="cell cell-host">{{host}}</div>
        <div class="cell cell-path">{{pathname}}</div>
        <div class="cell cell-type">{{type}}</div>
        <div class="cell cell-device">{{device}}</div>
        <div class="cell cell-time">{{duration}}</div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

  export default {
    props: ['index', 'id'],
    computed: {
      ...mapState(['selectRecordId', 'rightClickRecordId', 'recordMap']),
      ...mapGetters(['deviceIdNameMap']),
      row() {
        let curRow = this.recordMap[this.id];
        // 状态码
        // 请求类型
        // 请求耗时

        return curRow;
      },
      status() {
        try {
          return this.row.response.statusCode;
        } catch (e) {
          return '';
        }
      },
      method() {
        return this.row.originRequest.method;
      },
      protocol() {
        return this.row.originRequest.protocol;
      },
      host() {
        return this.row.originRequest.host;
      },
      pathname() {
        return this.row.originRequest.pathname;
      },
      type() {
        try {
          return this.row.originRequest.headers['content-type'];
        } catch (e) {
          return '';
        }
      },
      device() {
        try {
          let id = this.row.originRequest.deviceId;
          return this.deviceIdNameMap[id];
        } catch (e) {
          return '';
        }
      },
      duration() {
        try {
          return this.row.response.remoteResponseEndTime -
            this.row.response.remoteRequestBeginTime;
        } catch (e) {
          return '';
        }
      }
    },
    methods: {
      ...mapActions(['selectRecordById']),
      // 点击行
      clickRow(id) {
        this.selectRecordById(id);
      },

      rightClicked(event, recordId) {
        this.$emit('right-clicked', event, recordId);
      }

    }
  };
</script>
