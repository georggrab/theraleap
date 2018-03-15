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

@Component({
  components: { HandPlotter }
})
export default class LeapDebugInterface extends Vue {
  private deviceFacade: DeviceFacade;
  constructor() {
    super();
    this.deviceFacade = AppContainer.get(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
  }
}
</script>