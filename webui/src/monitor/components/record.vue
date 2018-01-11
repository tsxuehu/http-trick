<template>
    <div @click="clickRow(recordId)"
         :class="{'selected': $dc.selectId == recordId, 'right-clicked':$dc.rightClickId == recordId}"
         @contextmenu.prevent="rightClicked($event, recordId)"
         class="record row">
        <div class="cell cell-index">{{idx+1}}</div>
        <div class="cell cell-status">Status</div>
        <div class="cell cell-method">Method</div>
        <div class="cell cell-protocol">Protocol</div>
        <div class="cell cell-host">Host</div>
        <div class="cell cell-path">Path</div>
        <div class="cell cell-type">Type</div>
        <div class="cell cell-time">Time</div>
    </div>
</template>

<script>
    export default {
        props: ['idx'],
        computed: {
            recordId(){
                return this.$dc.filterdRecordArray[this.idx];
            }
        },
        methods: {
            // 点击行
            clickRow(index){
                this.$dc.setCurrentRowIndex(index);
            },

            rightClicked(event, recordId){
                this.$emit('right-clicked',event,recordId)
            }

        }
    };
</script>