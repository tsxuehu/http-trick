<template>
  <div style="height: 100%;width: 100%;font-size: 0;">
    <div style="width: 50%;height: 100%;display: inline-block">
      <request-detail></request-detail>
    </div>
    <div  style="width: 50%;height: 100%;display: inline-block">
      <response-detail></response-detail>
    </div>
  </div>
</template>

<script>
  import RequestDetail from './RequestDetail.vue'
  import ResponseDetail from './ResponseDetail.vue'
  export default {
    components: {
      RequestDetail, ResponseDetail
    }
  }
</script>
