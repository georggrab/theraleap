<template>
<section class="leap-debug-interface">
  <hand-plotter :handtracking-data="deviceFacade.getHandTrackingData()"></hand-plotter>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import DIIdent from '@/dependencyinjection/symbols';
import { Inject, Component } from 'vue-property-decorator';
import { AppContainer } from '@/dependencyinjection';
import { DeviceConnectionState, InitialDeviceState, DeviceFacade, DeviceDriver } from '@/devices';
import HandPlotter from '@/ui/HandPlotter.vue';

import * as device from '@/state/modules/device'

@Component({
  components: { HandPlotter }
})
export default class DeviceLog extends Vue {
  get deviceFacade(): DeviceFacade {
    return device.getDeviceFacade(this.$store);
  }
}
</script>