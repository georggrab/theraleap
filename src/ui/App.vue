<template>
<md-app>
  <md-app-toolbar class="md-primary" md-elevation="0">
    <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
      <md-icon>menu</md-icon>
    </md-button>
    <span class="md-title">TheraLeap</span>
    <div v-if="simulationRunning" class="simulated">
      <span>SIMULATED</span>
      <span @click="deactivateRecording" class="md-accent clickable">(STOP)</span>
    </div>
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
    <div class="transfer-rate" v-if="deviceDataTransferRate">{{ format(deviceDataTransferRate) }}/s</div>
    <div :class="{ 'menu-not-visible': !menuVisible }" class="md-toolbar-row">
        <router-view name="tabs"></router-view>
    </div>
  </md-app-toolbar>

  <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
    <md-toolbar class="md-transparent" md-elevation="0">
      <span>Navigation</span>

      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-dense" @click="toggleMenu">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-list>
      <md-list-item to="/debug" :class="{active: activeNavItem == 0}" @click="setActiveNavItem(0)">
          <md-icon>bug_report</md-icon>
          <span class="md-list-item-text">Debug</span>
      </md-list-item>

      <md-list-item to="/recorder" :class="{active: activeNavItem == 1}" @click="setActiveNavItem(1)">
        <md-icon>mic</md-icon>
        <span class="md-list-item-text">Device Recorder</span>
      </md-list-item>
    </md-list>
  </md-app-drawer>
  <md-app-content>
    <router-view name="main"></router-view>
  </md-app-content>
</md-app>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";

import ConnectionState from "@/ui/ConnectionState.vue";
import HandPlotter from "@/ui/HandPlotter.vue";
import DIIdent from "@/dependencyinjection/symbols";
import { AppContainer } from "@/dependencyinjection";
import {
  DeviceConnectionState,
  InitialDeviceState,
  DeviceFacade,
  DeviceDriver
} from "@/devices";
import { inject } from "inversify";

import * as device from "@/state/modules/device";
import * as record from "@/state/modules/record";

//@ts-ignore
import { format } from "sizeof";

/**
 * Main Vue.JS App
 * Creates a standard layout with a sidebar, header, and content area
 *   using the vue-material component library.
 * Displays the Status of the Device and the Transfer Rate in the Header
 *   (if the data is available, so if the respective vuex store plugins are enabled)
 * Expects two router-views for all children:
 *   - main, which represents the content area
 *   - tabs, which represents the tabs above the content area.
 */
@Component({
  components: {}
})
export default class App extends Vue {
  public menuVisible: boolean = false;
  public activeNavItem: number = -1;

  private format = format;

  public toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  public setActiveNavItem(to: number) {
    this.activeNavItem = to;
  }

  public deactivateRecording() {
    record.setActivatedId(this.$store, -1);
    device
      .getDeviceFacade(this.$store)
      .notifyStreamSourceShouldUpdate(this.$store);
  }

  get simulationRunning(): boolean {
    return record.getActiveRecording(this.$store) !== undefined;
  }

  get connectionHealthy(): boolean | undefined {
    return device.getConnectionHealthy(this.$store);
  }

  get deviceDataTransferRate(): number | undefined {
    return device.getDeviceDataTransferRate(this.$store);
  }
}
</script>
<style lang="scss">
@import "~styles/_globals.scss";
</style>

<style lang="scss" scoped>
@import "~styles/_vars.scss";

.md-app {
  border: 1px solid rgba(#000, 0.12);
  min-height: 50vh;
}

.md-app-drawer {
  margin-top: 50px;
}

.md-toolbar {
  padding-top: 10px;
}

.md-toolbar-row {
  padding-left: 0px;
}

.md-toolbar-row.menu-not-visible {
  padding-left: 20px;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-list-item.active span {
  font-weight: 700;
}

.md-list-item.active .md-icon {
  color: #303f9f;
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

.transfer-rate {
  font-family: monospace;
}

.simulated {
  display: flex;
  align-items: baseline;
  font-family: monospace;
  margin-left: 10px;
  .clickable {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
