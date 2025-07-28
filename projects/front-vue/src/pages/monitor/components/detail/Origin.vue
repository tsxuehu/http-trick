<template>
    <div class="origin">
        <div class="request__header">
            <div class="request__tab" :class="{'active':activeName == 'Header'}" @click="tabClick('Header')">Header
            </div>
            <div class="request__tab" :class="{'active':activeName == 'Cookie'}" @click="tabClick('Cookie')">Cookie
            </div>
            <div class="request__tab" :class="{'active':activeName == 'Query Params'}"
                 @click="tabClick('Query Params')">Query Params
            </div>
        </div>
        <div class="request__body">
            <div v-if="activeName == 'Header'">
                <key-value-list :data="originRequestHeader"></key-value-list>
            </div>
            <div v-if="activeName == 'Cookie'">
                <key-value-list :data="originRequestCookie"></key-value-list>
            </div>
            <div v-if="activeName == 'Query Params'">
                <key-value-list :data="originRequestQueryParams"></key-value-list>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import * as trafficApi from 'src/api/traffic';
  import './origin.scss';
  import KeyValueList from './KeyValueList.vue';

  export default {
    components: {KeyValueList},
    data() {
      return {
        activeName: 'Header'
      };
    },
    computed: {
      ...mapGetters(['currentSelectRecord']),

      // 原始请求的header键值对
      originRequestHeader() {
        try {
          return this.currentSelectRecord.originRequest.headers;
        } catch (e) {
          return {};
        }
      },

      originRequestCookie() {
        try {
          return trafficApi.parseCookie(this.currentSelectRecord.originRequest.headers.cookie || '');
        } catch (e) {
          return {};
        }
      },

      originRequestQueryParams() {
        try {
          return trafficApi.parseQuery(this.currentSelectRecord.originRequest.path);
        } catch (e) {
          return {};
        }
      },
    },
    methods: {

      tabClick(tab) {
        this.activeName = tab;
      }
    }
  };
</script>
