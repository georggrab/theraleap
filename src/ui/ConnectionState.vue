<template>
    <ul>
        <li>Connected: {{deviceState.deviceHardwareConnected? 'true': 'false'}}</li>
        <li>Server Online: {{deviceState.nativeDeviceDriverOnline? 'true': 'false'}}</li>
        <li>Connection Active: {{deviceState.connectedToNativeDeviceDriver? 'true': 'false'}}</li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator';

import { DeviceConnectionState, InitialDeviceState } from '@/devices';

@Component
export default class ConnectionState extends Vue {
    @Prop()
    public deviceState: DeviceConnectionState = InitialDeviceState;
}
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
}
</style>
