<template>
  <div>
    <h1>Leap Debug Intreface</h1>
    <connection-state :device-state="driverDeviceState"></connection-state>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

import ConnectionState from '@/ui/ConnectionState.vue';
import DIIdent from '@/dependencyinjection/symbols';
import { AppContainer } from '@/dependencyinjection';
import { DeviceConnectionState, InitialDeviceState, DeviceDriver } from 'devices';

@Component({
  components: { ConnectionState }
})
export default class DeviceDebugInterface extends Vue {
  private driver: DeviceDriver;
  private driverDeviceState: DeviceConnectionState = InitialDeviceState;

  constructor() {
    super();
    this.driver = AppContainer.get(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER);
  }

  private mounted(): void {
    const conn = this.driver.streamConnectionState();
    if (conn) {
      conn.subscribe((newDeviceState) => this.driverDeviceState = newDeviceState);
    }
  }

}
</script>