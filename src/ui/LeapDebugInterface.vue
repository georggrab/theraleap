<template>
  <main>
    <header>
      <section>TheraLeap Alpha</section>
      <aside>
        <connection-state :device-state="driverDeviceState"></connection-state>
      </aside>
    </header>
    <hand-plotter :handtracking-data="deviceFacade.getHandTrackingData()"></hand-plotter>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

import ConnectionState from '@/ui/ConnectionState.vue';
import HandPlotter from '@/ui/HandPlotter.vue';
import DIIdent from '@/dependencyinjection/symbols';
import { AppContainer } from '@/dependencyinjection';
import { DeviceConnectionState, InitialDeviceState, DeviceFacade, DeviceDriver } from '@/devices';
import { inject } from 'inversify';

@Component({
  components: { ConnectionState, HandPlotter }
})
export default class DeviceDebugInterface extends Vue {
  private deviceFacade: DeviceFacade;
  private driverDeviceState: DeviceConnectionState = InitialDeviceState;

  constructor() {
    super();
    this.deviceFacade = AppContainer.get(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
  }

  private mounted(): void {
    const conn = this.deviceFacade.getDeviceDriver().streamConnectionState();
    if (conn) {
      conn.subscribe((newDeviceState) => this.driverDeviceState = newDeviceState);
    }
  }

}
</script>
<style lang="scss">
@import '~styles/_globals.scss';
</style>

<style lang="scss" scoped>
@import '~styles/_vars.scss';

main {
  display: grid;
  grid-template-rows: 75px auto;
}

header {
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: $background-primary;
  color: $foreground-primary;
  border-bottom: 1px solid $foreground-primary;
  section {
    grid-column: 1 / span 1;
    padding: 10px;
    font-size: 2em;
  }
  aside {
    grid-column: 2 / span 1;
    font-size: smaller;
  }
}
</style>
