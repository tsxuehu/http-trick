<template>
    <div class="overview">
        <key-value-list :data="overviews"></key-value-list>
    </div>
</template>

<script>
    import './overview.pcss';
    import KeyValueList from './KeyValueList.vue';
    export default {
        components: { KeyValueList },
        computed: {
            overviews(){
                return {
                    'URL1': 'AAAadfasfasdfasdfasdAAAadfasfasdfasdfasdAAAadfasfasdfasdfasdAAAadfasfasdfasdfasd',
                    'URL2': 'aa',
                    'URL3': 'aa'
                };
            }
        }
    };
</script>