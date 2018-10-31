<template>
    <div class="device"
         @contextmenu.prevent="rightClicked($event, device.id)">
        <div class="name"  key="name">Name: {{device.name}}</div>
        <div class="host" v-if="device.hostFileName" key="host">HOST: {{device.hostFileName}}</div>
        <div class="id"  key="id">ID: {{device.id}}</div>
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
