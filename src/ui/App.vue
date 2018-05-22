<template>
<md-app>
  <md-app-toolbar class="md-primary" md-elevation="0">
    <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
      <md-icon>menu</md-icon>
    </md-button>
    <span class="md-title">TheraLeap</span>
    <device-status 
      :simulationRunning="simulationRunning"
      :connectionHealthy="connectionHealthy"
      @deactivateRecording="deactivateRecording"
    />
    <device-transfer-rate :transferRate="deviceDataTransferRate"></device-transfer-rate>
    <classify-badge></classify-badge>
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
          <md-icon>bug_report
            <md-tooltip md-direction="right">Debugger</md-tooltip>
          </md-icon>
          <span class="md-list-item-text">Debug</span>
      </md-list-item>

      <md-list-item to="/measurement" :class="{active: activeNavItem == 1}" @click="setActiveNavItem(1)">
          <md-icon>loupe
            <md-tooltip md-direction="right">Measurement</md-tooltip>
          </md-icon>
          <span class="md-list-item-text">Measurement</span>
      </md-list-item>

      <md-list-item to="/recorder" :class="{active: activeNavItem == 2}" @click="setActiveNavItem(2)">
        <md-icon>mic
          <md-tooltip md-direction="right">Device Recorder</md-tooltip>
        </md-icon>
        <span class="md-list-item-text">Device Recorder</span>
      </md-list-item>

      <md-list-item to="/data-processing" :class="{active: activeNavItem == 3}" @click="setActiveNavItem(3)">
        <md-icon>memory
          <md-tooltip md-direction="right">Data Processing</md-tooltip>
        </md-icon>
        <span class="md-list-item-text">Data Processing</span>
      </md-list-item>

      <md-list-item to="/classify" :class="{active: activeNavItem == 4}" @click="setActiveNavItem(4)">
        <md-icon>blur_on
          <md-tooltip md-direction="right">Classifier</md-tooltip>
        </md-icon>
        <span class="md-list-item-text">Classifier</span>
      </md-list-item>
      <md-list-item to="/games" :class="{active: activeNavItem == 5}" @click="setActiveNavItem(5)">
        <md-icon>games
          <md-tooltip md-direction="right">Games</md-tooltip>
        </md-icon>
        <span class="md-list-item-text">Games</span>
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
import DeviceStatus from "@/ui/utils/DeviceStatus.vue";
import ClassifyBadge from "@/ui/utils/ClassifyBadge.vue";
import DeviceTransferRate from "@/ui/DeviceTransferRate.vue";
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
  components: {
    DeviceStatus,
    DeviceTransferRate,
    ClassifyBadge
  }
})
export default class App extends Vue {
  public menuVisible: boolean = false;
  public activeNavItem: number = -1;

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
@import "~assets/_globals";
body {
  font-family: "Montserrat", sans-serif;
}
</style>
<style lang="scss" scoped>
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
</style>
