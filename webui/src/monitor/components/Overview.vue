<template>
    <div class="overview">
        <key-value-list :data="$dc.overviews"></key-value-list>
    </div>
</template>

<script>
    import './overview.pcss';
    import KeyValueList from './KeyValueList.vue';
    export default {
        components: { KeyValueList },
    };
</script>