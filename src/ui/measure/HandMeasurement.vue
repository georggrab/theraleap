<template>
   <section class="hand-measurement">
       <graphical-hand-logger class="logger" :source="trackingData" :handConfig="measureHandConfig" />
       <section class="measurements">
        <section class="configuration">
            <h1>Configuration</h1>
            <md-field>
                <label>Average Window</label>
                <md-input v-model="averageWindow" type="number" />
                <span class="md-helper-text">Specify over how many milliseconds you want to average the measurements.</span>
            </md-field>
        </section>
        <section v-if="numHandsAboveSensor !== 1" class="warnings">
            <h1>Warnings</h1>
            <s-code v-if="numHandsAboveSensor === 0">No Hand detected</s-code>
            <s-code v-if="numHandsAboveSensor >= 1">Only one hand please!</s-code>
        </section>
        <section class="measurements-angular">
            <h1>Angular Measurements</h1>
            <p class="measurement">
                <span class="measurement-label">Thumb / Index</span>
                <span class="measurement-value"><s-code>{{ angles.thumbIndex | displayAngle }}</s-code></span>
            </p>
            <p class="measurement">
                <span class="measurement-label">Index / Middle</span>
                <span class="measurement-value"><s-code>{{ angles.indexMiddle | displayAngle }}</s-code></span>
            </p>
            <p class="measurement">
                <span class="measurement-label">Middle / Ring</span>
                <span class="measurement-value"><s-code>{{ angles.middleRing | displayAngle }}</s-code></span>
            </p>
            <p class="measurement">
                <span class="measurement-label">Ring / Pinky</span>
                <span class="measurement-value"><s-code>{{ angles.ringPinky | displayAngle }}</s-code></span>
            </p>
        </section>
       </section>
   </section> 
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import * as device from "@/state/modules/device";
import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import Code from "@/ui/utils/Code.vue";

import { HandConfig } from "@/ui/graphics/types";
import { Subscription } from "rxjs";
import {
  LEAP_MOTION_DEVICE_NAME,
  LeapHandTrackingData
} from "devices/leapmotion";
import { GenericHandTrackingData } from "devices";

@Component({
  components: {
    GraphicalHandLogger,
    "s-code": Code
  },
  filters: {
    displayAngle: (value: number | undefined) => {
      if (value === undefined) {
        return "unknown";
      } else {
        return value.toString().padStart(3, "0") + " °";
      }
    }
  }
})
export default class HandMeasurement extends Vue {
  public averageWindow = 2500;
  public numHandsAboveSensor = 0;

  private frameSubscription: Subscription | undefined;

  public measureHandConfig: Partial<HandConfig> = {
    mainColor: 0xff0000,
    drawWireFrame: false
  };

  public angles: { [key: string]: number | undefined } = {
    thumbIndex: undefined,
    indexMiddle: undefined,
    middleRing: undefined,
    ringPinky: undefined
  };

  public mounted() {}

  public beforeDestroy() {
    this.frameSubscription && this.frameSubscription.unsubscribe();
  }

  private setupSubscription() {
    if (this.trackingData !== undefined) {
      this.frameSubscription = this.trackingData.subscribe(
        (genericFrame: GenericHandTrackingData) => {
          if (this.deviceName === LEAP_MOTION_DEVICE_NAME) {
            const frame: LeapHandTrackingData = genericFrame;
            this.numHandsAboveSensor = frame.data.hands.length;
          } else {
            console.warn(
              "Measurements not implemented for device:",
              this.deviceName
            );
          }
        }
      );
    }
  }

  private deviceName = device.getDeviceFacade(this.$store).getDeviceDriver()
    .deviceName;

  private trackingData = device
    .getDeviceFacade(this.$store)
    .getHandTrackingData(this.$store);
}
</script>

<style lang="scss" scoped>
.hand-measurement {
  display: flex;
  height: calc(100vh - 150px);
  .logger {
    flex: 1;
  }
  .measurements {
    flex: 1;
    margin-left: 25px;
  }
}

.configuration {
  .md-field {
    width: 250px;
    margin-top: -15px;
    margin-bottom: 70px;
  }
}

.measurements-angular {
  .measurement {
    padding-left: 25px;
    max-width: 350px;
    display: flex;
    .measurement-label {
      font-weight: 200;
      flex: 1;
    }
    .measurement-value {
      flex: 1;
    }
  }
}

.warnings {
  h1 {
    background-color: darkred;
    color: white;
    padding: 5px;
  }
  .source {
    margin-left: 25px;
  }
}
</style>
