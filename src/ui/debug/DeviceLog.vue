<template>
<section class="leap-debug-interface">
  <raw-device-data-plotter :handtracking-data="deviceFacade.getHandTrackingData()"></raw-device-data-plotter>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import DIIdent from '@/dependencyinjection/symbols';
import { Inject, Component } from 'vue-property-decorator';
import { AppContainer } from '@/dependencyinjection';
import { DeviceConnectionState, InitialDeviceState, DeviceFacade, DeviceDriver } from '@/devices';
import RawDeviceDataPlotter from '@/ui/RawDeviceDataPlotter.vue';

import * as device from '@/state/modules/device'

@Component({
  components: { RawDeviceDataPlotter }
})
export default class DeviceLog extends Vue {
  get deviceFacade(): DeviceFacade {
    return device.getDeviceFacade(this.$store);
  }
}
</script>