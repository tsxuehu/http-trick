<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Response Header">
      <key-value-list :data="$dc.responseHeader"></key-value-list>
    </el-tab-pane>
    <el-tab-pane label="Response Set Cookie">
      <div class="cookie-row" v-for="row in $dc.setCookies">
        {{row}}
      </div>
    </el-tab-pane>
    <el-tab-pane label="Response Raw Header">
      <textarea class="text-area">{{$dc.responseRawHeader}}</textarea>
    </el-tab-pane>
    <el-tab-pane label="Response Body">
      <textarea class="text-area">{{$dc.currentResponseBody}}</textarea>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import KeyValueList from './KeyValueList.vue'
  export default {
    components: {KeyValueList}
  }
</script>

<style lang="postcss">
  .cookie-row {
    border-bottom: solid 1px #dfe6ec;
    font-size: 12px;
    padding-left: 5px;
  }
</style>
