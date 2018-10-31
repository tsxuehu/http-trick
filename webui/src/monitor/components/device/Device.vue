<template>
    <div class="device"
         @contextmenu.prevent="rightClicked($event, device.id)">
        <div class="name">{{device.name}}</div>
        <div class="id">{{device.id}}</div>
        <div class="status offline" v-if="device.disableMonitor"></div>
        <div class="status online" v-if="!device.disableMonitor"></div>
    </div>
</template>

<script>
    import './device.pcss'

    export default {
        name: "Device",
        props: ["device"],
        methods: {
            requestRemoveDevice() {

            },
            requestSetName() {

            },
            setName(deviceId, name) {

            },
            rightClicked(event, recordId) {
                this.$emit('right-clicked', event, recordId);
            }
        }
    }
</script>
