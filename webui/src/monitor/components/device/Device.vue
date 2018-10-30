<template>
    <div class="device">
        <div class="name">{{device.name}}</div>
        <div class="id">{{device.id}}</div>
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

            }
        }
    }
</script>
