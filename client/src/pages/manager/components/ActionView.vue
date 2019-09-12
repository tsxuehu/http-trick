<template>
    <div class="action-value-container">
        <!-- 参数设置- 请求转发 -->
        <div v-if="action.type == 'redirect'" class="value-redirect row">
            <span class="name">转发</span>
            <span class="value">{{action.data.target}}</span>
        </div>
        <div v-if="action.type == 'mockData'" class="value-mock-data row">
            <span class="name">返回mock数据</span>
            <span class="value">{{datafileEntry.name}}</span>
        </div>
        <div v-if="action.type == 'addRequestCookie'" class="value-key-value row">
            <span class="name">设置请求Cookie</span>
            <span class="value">{{action.data.cookieKey}}:{{action.data.cookieValue}}</span>
        </div>
        <div v-if="action.type == 'addRequestHeader'" class="value-key-value row">
            <span class="name">设置请求头</span>
            <span class="value">{{action.data.reqHeaderKey}}:{{action.data.reqHeaderValue}}</span>
        </div>
        <div v-if="action.type == 'addQuery'" class="value-key-value row">
            <span class="name">增加请求Query</span>
            <span class="value">{{action.data.queryKey}}:{{action.data.queryValue}}</span>
        </div>
        <div v-if="action.type == 'addResponseHeader'" class="value-key-value row">
            <span class="name">增加响应头</span>
            <span class="value">{{action.data.resHeaderKey}}:{{action.data.resHeaderValue}}</span>
        </div>
        <!-- 修改返回内容 -->
        <div v-if="action.type == 'modifyResponse'" class="value-modify-response row">
            <span class="name">修改响应Body</span>
            <span class="value">{{modifyResponseDescription}}</span>
        </div>
        <!-- 脚本修改请求 -->
        <div v-if="action.type == 'scriptModifyRequest'" class="value-script row">
            <span class="name">Js修改请求内容</span>
            <span class="value">{{action.data.modifyRequestScript}}</span>
        </div>
        <!-- 脚本修改响应 -->
        <div v-if="action.type == 'scriptModifyResponse'" class="value-script">
            <span class="name">Js修改响应内容</span>
            <span class="value">{{action.data.modifyResponseScript}}</span>
        </div>
    </div>
</template>

<script>
  import find from 'lodash/find';

  export default {
    name: 'actionView',
    props: ['action', 'dataList'],
    data() {
      return {
        modifyResponseType: [
          {value: 'addTimestampToJsCss', label: '将html中的js、css请求加上时间戳'},
          {value: 'returnDataInJsonpStyle', label: '以JSONP的方式返回数据'},
          {value: 'allowCros', label: '增加跨域头部'},
          {value: 'return404', label: '返回404'}
        ]
      };
    },
    computed: {
      datafileEntry() {
        if (this.action.type == "mockData") {
          var finded = find(this.dataList, (entry) => {
            return entry.id == this.action.data.dataId;
          });
          if (!finded) return {name: '!没有找到数据文件!'};
          return finded;
        }
      },
      modifyResponseDescription() {
        if (this.action.type == "modifyResponse") {
          var finded = find(this.modifyResponseType, (entry) => {
            return entry.value == this.action.data.modifyResponseType;
          });
          if (!finded) return '未知类型';
          if (finded.value != 'returnDataInJsonpStyle') {
            return finded.label;
          }
          return finded.label + '( callback参数名: ' + action.data.callbackName + ' )';
        }
        return '';
      }
    },

  };

</script>
