<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span class="md-title">TheraLeap</span>
            <div v-if="connectionIsOkay" class="device-status device-status--good">
              <md-icon>settings_remote
                <md-tooltip md-direction="top">Connected to Leap Device.</md-tooltip>
              </md-icon>
            </div>
            <div v-else class="device-status device-status--bad">
              <md-icon>settings_remote
                <md-tooltip md-direction="top">No connection to Leap Device. Check Status Tab.</md-tooltip>
              </md-icon>
              <md-progress-spinner class="md-accent" :md-stroke="2" :md-diameter="30" md-mode="indeterminate"></md-progress-spinner>
            </div>
          </div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab id="tab-home" md-label="Raw Device Logger"></md-tab>
            <md-tab id="tab-pages" md-label="Hand Logger"></md-tab>
            <md-tab id="tab-posts" md-label="Status"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>build</md-icon>
            <span class="md-list-item-text">Debug Interface</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>
      <md-app-content>
        <hand-plotter :handtracking-data="deviceFacade.getHandTrackingData()"></hand-plotter>
      </md-app-content>
    </md-app>
  </div>
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
  private connectionIsOkay: boolean | undefined = false;

  constructor() {
    super();
    this.deviceFacade = AppContainer.get(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
  }

  private mounted(): void {
    const conn = this.deviceFacade.getDeviceDriver().streamConnectionState();
    if (conn) {
      conn.subscribe((update) => {
        this.driverDeviceState = update;
        this.connectionIsOkay = update.nativeDeviceDriverOnline 
          && update.deviceHardwareConnected 
          && update.connectedToNativeDeviceDriver;
      });
    }
  }

}
</script>
<style lang="scss">
@import '~styles/_globals.scss';
</style>

<style lang="scss" scoped>
@import '~styles/_vars.scss';

.md-app {
  border: 1px solid rgba(#000, .12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.device-status {
  position: relative;
  margin-left: 20px;
}

.device-status--good {
  .md-progress-spinner {
    display: none;
  }
  .md-icon {
    padding-left: 4px;
  }
}

.device-status--bad {
  .md-progress-spinner {
    float: left;
  }
  .md-icon {
    left: 2px;
    top: 3px;
    position: absolute;
  }
}
</style>
