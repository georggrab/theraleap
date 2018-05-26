<template>
   <section class="hand-measurement">
       <graphical-hand-logger class="logger" :source="trackingData" :handConfig="measureHandConfig" />
       <section class="measurements">
        <section class="configuration">
            <h1>Configuration</h1>
            <md-field>
                <label>Average Window</label>
                <md-input :value="averageWindow" v-model="averageWindow" type="number" />
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

import { Subscription } from "rxjs";
import { bufferTime, tap } from "rxjs/operators";

import * as device from "@/state/modules/device";
import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import Code from "@/ui/utils/Code.vue";

import { HandConfig } from "@/ui/graphics/types";
import {
  LEAP_MOTION_DEVICE_NAME,
  LeapHandTrackingData,
  LeapPointable
} from "@/devices/leapmotion";
import { GenericHandTrackingData } from "@/devices";

import {
  calculatePointableAngle,
  sortPointables
} from "@/ui/measure/measureUtils";

@Component({
  components: {
    GraphicalHandLogger,
    "s-code": Code
  },
  filters: {
    displayAngle: (value: number | undefined) => {
      if (value === undefined || Number.isNaN(value)) {
        return "unknown";
      } else {
        return (
          Math.round(value)
            .toString()
            .padStart(3, "0") + " °"
        );
      }
    }
  }
})
export default class HandMeasurement extends Vue {
  public numHandsAboveSensor = 0;
  public pAverageWindow: number = 2500;

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

  get averageWindow() {
    return this.pAverageWindow;
  }

  set averageWindow(value: number) {
    this.resetSubscription();
    this.setupSubscription(value);
    this.pAverageWindow = value;
  }

  public mounted() {
    this.setupSubscription(this.averageWindow);
  }

  public beforeDestroy() {
    this.resetSubscription();
  }

  private setupSubscription(windowSize: number) {
    if (this.trackingData !== undefined) {
      this.frameSubscription = this.trackingData
        .pipe(
          tap(data => {
            if (this.deviceName === LEAP_MOTION_DEVICE_NAME) {
              const frame: LeapHandTrackingData = data;
              this.numHandsAboveSensor = frame.data.hands.length;
            } else {
              console.warn(
                "Measurements not implemented for device:",
                this.deviceName
              );
            }
          }),
          bufferTime(windowSize, 500)
        )
        .subscribe(this.performMeasurement);
    }
  }

  private resetSubscription() {
    this.frameSubscription && this.frameSubscription.unsubscribe();
  }

  private performMeasurement(data: GenericHandTrackingData[]) {
    if (this.deviceName !== LEAP_MOTION_DEVICE_NAME) return;
    const frames: LeapHandTrackingData[] = data;
    let numFramesProcessed = 0;
    const angles = {
      thumbIndex: 0,
      indexMiddle: 0,
      middleRing: 0,
      ringPinky: 0
    };
    frames.forEach(frame => {
      const sortedPointables = sortPointables(frame);
      if (sortedPointables !== undefined) {
        numFramesProcessed++;
        const [thumb, index, middle, ring, pinky] = sortedPointables;
        angles.thumbIndex += calculatePointableAngle(thumb, index);
        angles.indexMiddle += calculatePointableAngle(index, middle);
        angles.middleRing += calculatePointableAngle(middle, ring);
        angles.ringPinky += calculatePointableAngle(ring, pinky);
      }
    });
    this.angles = {
      thumbIndex: angles.thumbIndex / numFramesProcessed,
      indexMiddle: angles.indexMiddle / numFramesProcessed,
      middleRing: angles.middleRing / numFramesProcessed,
      ringPinky: angles.ringPinky / numFramesProcessed
    };
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
