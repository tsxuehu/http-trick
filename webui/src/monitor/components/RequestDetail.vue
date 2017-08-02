<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Header">
      <key-value-list :data="$dc.requestHeader"></key-value-list>
    </el-tab-pane>
    <el-tab-pane label="Cookie">
      <key-value-list :data="$dc.requestCookie"></key-value-list>
    </el-tab-pane>
    <el-tab-pane label="Query Params">
      <key-value-list :data="$dc.requestQueryParams"></key-value-list>
    </el-tab-pane>
    <el-tab-pane label="Raw Header">
      <textarea class="text-area">{{$dc.requestRawHeader}}</textarea>
    </el-tab-pane>
    <el-tab-pane label="Body">
       <textarea class="text-area">{{$dc.currentRequestBody}}</textarea>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import KeyValueList from './KeyValueList.vue'
  export default {
    components: {KeyValueList}
  }
</script>
