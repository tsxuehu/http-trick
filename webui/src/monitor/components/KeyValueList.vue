<template>
  <div class="keyvalue-wrapper">
    <template v-for="value,key in data">
      <div class="keyvalue-row">
        <div class="keyvalue-key">
          {{key}}
        </div>
        <div class="keyvalue-value">
          {{value}}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: ["data"]
  }
</script>

<style lang="postcss">
  .keyvalue-wrapper {
    height: 100%;
    width: 100%;
    overflow: scroll;
    font-size: 12px;
  }

  .keyvalue-row {
    border-bottom: solid 1px #dfe6ec;
    height: 22px;
    line-height: 22px;
    white-space: nowrap;
  }

  .keyvalue-key {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    border-right: solid 1px #dfe6ec;
    padding-left: 5px;
  }

  .keyvalue-value {
    display: inline-block;
    padding-left: 5px;
    vertical-align: top;
  }
</style>
