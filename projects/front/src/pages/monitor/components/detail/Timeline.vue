<template>
    <div>
        <key-value-list :data="timeline"></key-value-list>
    </div>
</template>

<script>
  import KeyValueList from './KeyValueList.vue';

  export default {
    components: {KeyValueList},
    computed: {
      timeline(){
        return {
          '请求': ''
        }
      }
    }
  }
</script>
