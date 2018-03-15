<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span class="md-title">TheraLeap</span>
            <div v-if="connectionHealthy" class="device-status device-status--good">
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
            <router-view name="tabs"></router-view>
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
        <router-view name="main"></router-view>
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

import * as device from '@/state/modules/device'

@Component({
  components: { }
})
export default class App extends Vue {
  get connectionHealthy(): boolean | undefined {
    return device.getConnectionHealthy(this.$store);
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
