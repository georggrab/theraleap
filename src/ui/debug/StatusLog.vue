<template>
<section class="device-status">
    <md-card v-if="connectionState.connectedToNativeDeviceDriver === undefined" md-theme="card-unknown" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Native Device Driver</div>
          <div class="md-subhead">
            Could not determine if we are connected to the native device driver.
          </div>
          <md-card-content>
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else-if="!connectionState.connectedToNativeDeviceDriver" md-theme="card-failure" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Native Device Driver</div>
          <div class="md-subhead">
            The Native Device Driver is offline.
          </div>
          <md-card-content>
            Please make sure the native device driver for your machine is installed and running.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else md-theme="card-success" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Hardware Device</div>
          <div class="md-subhead">
            The native device driver is Online.
          </div>
          <md-card-content>
            We have a streaming connection to the native device driver. Everything works as expected.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-if="connectionState.nativeDeviceDriverOnline === undefined" md-theme="card-unknown" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">State of the Native Device Driver</div>
          <div class="md-subhead">
            Unknown.
          </div>
          <md-card-content>
            It could not be determined if the native device driver is online. Please make sure your device driver is installed and running on this machine.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else-if="!connectionState.connectedToNativeDeviceDriver" md-theme="card-failure" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">State of the Native Device Driver</div>
          <div class="md-subhead">
            This application is not connected to the native device driver.
          </div>
          <md-card-content>
            We will automatically attempt to connect to the native device driver once it has come online. Please make sure the native device driver is running.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else md-theme="card-success" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">State of the Native Device Driver</div>
          <div class="md-subhead">
            The native device driver is Online.
          </div>
          <md-card-content>
            We have a streaming connection to the native device driver, which is working as expected.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-if="connectionState.deviceHardwareConnected === undefined" md-theme="card-unknown" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Hardware Device</div>
          <div class="md-subhead">
            Could not determine if the Hardware device is Connected. 
          </div>
          <md-card-content>
            Usually this means that the Hardware device driver is offline, so we can't determine whether the device is connected. Please make sure your device driver is installed and running. We'll automatically attempt to reconnect.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else-if="!connectionState.deviceHardwareConnected" md-theme="card-failure" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Hardware Device</div>
          <div class="md-subhead">
            The Hardware Device seems not connected.
          </div>
          <md-card-content>
            We are not getting any data from the native device driver, which usually means that the device is not attached to the computer. Please Plug your device into the Computer if it isn't already. We'll automatically attempt to reconnect.
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card v-else md-theme="card-success" md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Connection to Hardware Device</div>
          <div class="md-subhead">
            The Hardware Device is connected.
          </div>
          <md-card-content>
            We are connected to the Hardware Device and it is sending data properly. Let's play some games!
          </md-card-content>
        </md-card-header-text>
      </md-card-header>
    </md-card>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

import * as device from '@/state/modules/device'
import { DeviceFacade, DeviceConnectionState } from 'devices';

@Component({
  components: { }
})
export default class StatusLog extends Vue {
  get connectionState(): DeviceConnectionState { 
    return device.getConnectionState(this.$store);
  }
}
</script>
<style lang="scss" scoped>
section.device-status {
  margin-top: 20px;
}
</style>
