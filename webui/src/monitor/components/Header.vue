<template>
  <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
       style="width: 100%; height: 250px;">
    <div class="el-table__header-wrapper">
    </div>
    <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
      :style="[bodyHeight]">
    </div>
    <div class="el-table__column-resize-proxy" style="left: 201px; display: none;"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>
<script>

  export default {
    data(){
      return {
        resizeProxyVisible: false
      }
    },
  }
</script>


<style lang="postcss">

</style>
