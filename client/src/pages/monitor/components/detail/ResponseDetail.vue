<template>
    <div class="response">
        <div class="response__header">
            <div class="response__tab" :class="{'active':activeName == 'Header'}" @click="tabClick('Header')">Header
            </div>
            <div class="response__tab" :class="{'active':activeName == 'Set Cookies'}" @click="tabClick('Set Cookies')">
                Set Cookies
            </div>
            <div class="response__tab" :class="{'active':activeName == 'Body'}" @click="tabClick('Body')">Body</div>
        </div>
        <div class="response__body">
            <div v-if="activeName == 'Header'">
                <key-value-list :data="responseHeader"></key-value-list>
            </div>
            <div class="set-cookies" v-if="activeName == 'Set Cookies'">
                <div class="cookie-row" v-for="row in setCookies">
                    {{row}}
                </div>
            </div>
            <div v-if="activeName == 'Body'" class="text-area">{{currentResponseBody}}</div>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import KeyValueList from './KeyValueList.vue';
  import './responsedetail.scss'

  export default {
    components: {KeyValueList},
    data() {
      return {
        activeName: 'Header'
      };
    },
    computed: {
      ...mapState(['currentResponseBody']),
      ...mapGetters(['currentSelectRecord']),
      responseHeader() {
        try {
          let headers = Object.assign({}, this.currentSelectRecord.response.headers);
          delete headers['set-cookie'];
          return headers;
        } catch (e) {
          return {};
        }
      },
      setCookies() {
        try {
          return this.currentSelectRecord.response.headers['set-cookie'] || [];
        } catch (e) {
          return [];
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
