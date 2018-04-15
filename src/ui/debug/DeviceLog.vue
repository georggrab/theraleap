<template>
<section class="leap-debug-interface">
  <raw-device-data-plotter :handtracking-data="trackingData"></raw-device-data-plotter>
</section>
</template>
<script lang="ts">
import Vue from "vue";
import { Observable, Subscription } from "rxjs";

import DIIdent from "@/dependencyinjection/symbols";
import { Inject, Component } from "vue-property-decorator";
import { AppContainer } from "@/dependencyinjection";
import {
  DeviceConnectionState,
  InitialDeviceState,
  DeviceFacade,
  DeviceDriver,
  GenericHandTrackingData
} from "@/devices";
import RawDeviceDataPlotter from "@/ui/debug/RawDeviceDataPlotter.vue";

import * as device from "@/state/modules/device";
@Component({
  components: { RawDeviceDataPlotter }
})
export default class DeviceLog extends Vue {
  public trackingData: GenericHandTrackingData = { data: {} };
  private subscription: Subscription | undefined;

  public mounted() {
    const data = this.deviceFacade.getHandTrackingData(this.$store);
    if (data) {
      this.subscription = data.subscribe(deviceFrame => {
        this.trackingData = deviceFrame;
      });
    }
  }

  public beforeDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get deviceFacade(): DeviceFacade {
    return device.getDeviceFacade(this.$store);
  }
}
</script>
