<template>
    <div class="request">
        <div class="request__header">
            <div class="request__tab" :class="{'active':activeName == 'Header'}" @click="tabClick('Header')">Header
            </div>
            <div class="request__tab" :class="{'active':activeName == 'Cookie'}" @click="tabClick('Cookie')">Cookie
            </div>
            <div class="request__tab" :class="{'active':activeName == 'Query Params'}"
                 @click="tabClick('Query Params')">Query Params
            </div>
            <div class="request__tab" :class="{'active':activeName == 'Body'}" @click="tabClick('Body')">Body</div>
        </div>
        <div class="request__body">
            <div v-if="activeName == 'Header'">
                <key-value-list :data="requestHeader"></key-value-list>
            </div>
            <div v-if="activeName == 'Cookie'">
                <key-value-list :data="requestCookie"></key-value-list>
            </div>
            <div v-if="activeName == 'Query Params'">
                <key-value-list :data="requestQueryParams"></key-value-list>
            </div>
            <div v-if="activeName == 'Body'" class="text-area">{{currentRequestBody}}</div>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import KeyValueList from './KeyValueList.vue';
  import './requestdetail.scss';
  import * as trafficApi from 'src/api/traffic';
  export default {
    components: {KeyValueList},
    data() {
      return {
        activeName: 'Header'
      };
    },
    computed: {
      ...mapState(['currentRequestBody']),
      ...mapGetters(['currentSelectRecord']),
      // 当前请求的header键值对
      requestHeader() {
        try {
          return  this.currentSelectRecord.requestData.headers;
        } catch (e) {
          return {};
        }
      },

      requestCookie() {
        try {
          return trafficApi.parseCookie(this.currentSelectRecord.requestData.headers.cookie || '');
        } catch (e) {
          return {};
        }
      },

      requestQueryParams() {
        try {
          return trafficApi.parseQuery(this.currentSelectRecord.requestData.path);
        } catch (e) {
          return {};
        }
      }
    },
    methods: {
      tabClick(tab) {
        this.activeName = tab;
      }
    }
  };
</script>
