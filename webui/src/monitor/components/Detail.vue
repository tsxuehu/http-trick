<template>
    <div class="detail">
        <div class="detail__header">
            <div class="detail__tab" :class="{'active':activeName == 'Overview'}" @click="tabClick('Overview')">Overview</div>
            <div class="detail__tab" :class="{'active':activeName == 'Request'}" @click="tabClick('Request')">Request</div>
            <div class="detail__tab" :class="{'active':activeName == 'Response'}" @click="tabClick('Response')">Response</div>
            <div class="detail__tab" :class="{'active':activeName == 'Timeline'}" @click="tabClick('Timeline')">Timeline</div>
        </div>
        <div class="detail__body">
            <div v-if="activeName == 'Overview'">
                <overview></overview>
            </div>
            <div v-if="activeName == 'Request'">
                <request-detail></request-detail>
            </div>
            <div v-if="activeName == 'Response'">
                <response-detail></response-detail>
            </div>
            <div v-if="activeName == 'Timeline'">
                <timeline></timeline>
            </div>
        </div>
    </div>
</template>

<script>
    import RequestDetail from './RequestDetail.vue';
    import ResponseDetail from './ResponseDetail.vue';
    import Overview from './Overview.vue';
    import Timeline from './Timeline.vue';
    import './detail.pcss';
    export default {
        components: {
            RequestDetail, ResponseDetail, Overview, Timeline
        },
        data(){
            return {
                activeName: 'Overview'
            };
        },
        methods: {
            tabClick(tab){
                this.activeName = tab;
            }
        }
    };
</script>
