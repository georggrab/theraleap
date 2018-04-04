<template>
<section class="hand-player">
    <graphical-hand-logger
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

import * as device from '@/state/modules/device'
import { DeviceFacade, DeviceConnectionState } from 'devices';

@Component({
  components: { },
})
export default class StatusLog extends Vue {
  get connectionState(): DeviceConnectionState { 
    return device.getConnectionState(this.$store);
  }
}
</script>
<style lang="scss" scoped>
</style>
