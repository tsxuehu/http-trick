<template>
    <div class="action-value-container">
        <!-- 参数设置- 请求转发 -->
        <div v-if="action.type == 'redirect'" class="value-redirect">
            <el-input v-model="action.data.target"
                      size="small"
                      style="width:500px;"
                      :placeholder="redirectPlaceholder">
            </el-input>
            <el-button type="text" @click="$emit('test-rule')">
                测试
            </el-button>
        </div>
        <!-- 参数设置- 返回自定义数据 el-select的一个bug，当el-select从界面中消失的时候会解绑事件。。所以用v-show -->
        <div v-if="action.type == 'mockData'" class="value-mock-data">
            <el-select v-model="action.data.dataId"
                       style="width: 250px"
                       size="small"
                       filterable
                       placeholder="请选择要返回的数据">
              <el-option
                      v-for="dataentry in dataList"
                      :label="dataentry.name" :key="dataentry.id"
                      :value="dataentry.id">
              </el-option>
            </el-select>
            <el-button type="text"  v-if="datafileEntry" @click="$emit('edit-data-file', datafileEntry)">
              编辑数据
            </el-button>
            <el-button type="text" @click="$emit('new-data-file')">增加自定义数据</el-button>
        </div>
        <!-- 设置cookie -->
        <div v-if="action.type == 'addRequestCookie'" class="value-key-value">
            <div class="row">
                <span class="label">Cookie Key</span>
                <el-input class="value"
                          v-model="action.data.cookieKey"
                          size="small"
                          placeholder="cookie key">
                </el-input>
            </div>
            <div class="row row-last">
                <span class="label">Cookie Value</span>
                <el-input class="value"
                          v-model="action.data.cookieValue"
                          size="small"
                          placeholder="cookie value">
                </el-input>
            </div>
        </div>
        <!-- 增加请求头 -->
        <div v-if="action.type == 'addRequestHeader'" class="value-key-value">
            <div class="row">
                <span class="label">Header Key</span>
                <el-input class="value"
                          v-model="action.data.reqHeaderKey"
                          size="small"
                          placeholder="header key">
                </el-input>
            </div>
            <div class="row">
                <span class="label">Header Value</span>
                <el-input class="value"
                          v-model="action.data.reqHeaderValue"
                          size="small"
                          placeholder="header value">
                </el-input>
            </div>
        </div>
        <!-- 增加请求Query -->
        <div v-if="action.type == 'addQuery'" class="value-key-value">
            <div class="row">
                <span class="label">Query Key</span>
                <el-input class="value"
                          v-model="action.data.queryKey"
                          size="small"
                          placeholder="query key">
                </el-input>
            </div>
            <div class="row">
                <span class="label">Query Key</span>
                <el-input class="value"
                          v-model="action.data.queryValue"
                          size="small"
                          placeholder="query value">
                </el-input>
            </div>
        </div>
        <!-- 增加响应头 -->
        <div v-if="action.type == 'addResponseHeader'" class="value-key-value">
            <div class="row">
                <span class="label">Header Key</span>
                <el-input class="value"
                          v-model="action.data.resHeaderKey"
                          size="small"
                          placeholder="header key">
                </el-input>
            </div>
            <div class="row">
                <span class="label">Header Key</span>
                <el-input class="value"
                          v-model="action.data.resHeaderValue"
                          size="small"
                          placeholder="header value">
                </el-input>
            </div>
        </div>
        <!-- 修改返回内容 -->
        <div v-if="action.type == 'modifyResponse'" class="value-modify-response">
            <div class="action-data">
                <el-select v-model="action.data.modifyResponseType" style="width: 260px"
                           size="small" placeholder="请选择修改返回body操作">
                    <el-option v-for="item in modifyResponseType" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <span v-if="action.data.modifyResponseType == 'returnDataInJsonpStyle'">
                  <el-input v-model="action.data.callbackName" size="small" style="width:200px;"
                            placeholder="jsonp callback参数名">
                  </el-input>
                </span>
            </div>
        </div>
        <!-- 脚本修改请求 -->
        <div v-if="action.type == 'scriptModifyRequest'" class="value-script">
            <textarea style="width: 100%;height: 90px" v-model="action.data.modifyRequestScript">
            </textarea>
        </div>
        <!-- 脚本修改响应 -->
        <div v-if="action.type == 'scriptModifyResponse'" class="value-script">
            <textarea style="width: 100%;height: 90px" v-model="action.data.modifyResponseScript">
            </textarea>
        </div>
    </div>
</template>

<script>
  import find from 'lodash/find';

  export default {
    name: 'action-value',
    props: ['action', 'dataList', 'allowRedirectToLocal'],
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
          if (!finded) this.action.data.dataId = '';
          return finded;
        }
      },
      redirectPlaceholder() {
        if (this.allowRedirectToLocal) {
          return '填写转发路径(远程地址、或者本地地址。远程地址需要以http/https开头)'
        } else {
          return '填写转发路径(必须以http/https开头)'
        }
      }
    },

  };

</script>
