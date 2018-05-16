<template>
    <section class="pre-processing">
    <div class="cancelmargin">
        <transition name="slide">
            <section v-if="showIntro">
                <div class="intro">
                    <div class="header">
                        <h1><md-icon class="white-icon spin md-size-2x">memory</md-icon>Data Preprocessing Configuration</h1>
                        <span @click="showIntro = false"><md-icon class="white-icon">clear</md-icon></span>
                    </div>
                    <div class="content">
                        Toggle and configure various data preprocessing routines here. All Data Preprocessing is done right after the data is sent from the device, and immediately before the Device Data is fed into the Classification Engine. The main goal of the Preprocessing Routines is to provide the Classification Routines with less data that is not useful for their operation, and thus increase classification performance.
                    </div>
                </div>
            </section>
        </transition>
    </div>
    <md-card md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon>whatshot</md-icon>Destroy Useless Frames</div>
          <div class="md-subhead">Destroy Frames that don't contain relevant data immediately.</div>
        </md-card-header-text>
          <div class="enabled">
              <md-switch v-model="uselessFrameSwitch"
                @change="preprocessorSelectionUpdated"
                class="md-accent">Enable</md-switch>
          </div>
      </md-card-header>

      <md-card-content>
          This Leap Motion specific preprocessor is based on a very simple assumption: if device
          frames contain no actual hand tracking data, they are of no use to us! Thus, this preprocessor
          will filter tracking data containing no useful information.
      </md-card-content>
      <div class="type">
          <span>LEAP MOTION SPECIFIC</span>
      </div>
    </md-card>
    <md-card md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon>content_cut</md-icon>Naive Throttler</div>
          <div class="md-subhead">Drop every nth Frame from the Hand Tracking Device</div>
        </md-card-header-text>
          <div class="enabled">
              <md-switch v-model="naiveThrottlerSwitch"
                @change="preprocessorSelectionUpdated"
                class="md-accent">Enable</md-switch>
          </div>
      </md-card-header>

      <md-card-content>
          Take only every nth Frame from the Hand Tracking Device. 
          Useful for initially reducing Framerate or for deploying the software on very weak hardware. 
          Naive in the sense that it does not look at the data. 
          It will throw away potentially valuable information!
          Configure this Preprocessor with a whole Integer <span class="source">n</span> (as in,
          take every <span class="source">n</span>th frame). <br />
          Choosing criteria: <span class="source">modulus(index<sub>frame</sub>, n) = 0</span>
      </md-card-content>

      <md-card-actions md-alignment="left">
        <md-field>
          <label>n</label>
          <md-input v-model="naiveThrottlerN" type="number"></md-input>
          <span class="md-helper-text">Take every nth frame</span>
        </md-field>
      </md-card-actions>
      <div class="type">
          <span>GENERIC</span>
      </div>
    </md-card>
    <md-card md-with-hover>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon>av_timer</md-icon>FPS Throttler</div>
          <div class="md-subhead">Temporal rate limit of physical device frames</div>
        </md-card-header-text>
          <div class="enabled">
              <md-switch v-model="fpsThrottlerSwitch"
                @change="preprocessorSelectionUpdated"
                class="md-accent">Enable</md-switch>
          </div>
      </md-card-header>

      <md-card-content>
          The Websocket based Leap Motion device driver is lacking one very important feature at the moment 
          (<span class="source">Leap Motion SDK2, APIv7</span>): we can't specify at what rate the device should
          send frames to us! Because of this, the device is generating lots of unnecessary data, as most of the
          time a lower framerate suffices for the classification. Use this preprocessor to limit the framerate from
          the device to a fixed rate. The usual framerate coming from the Leap Motion device is <span class="source">100 FPS</span>.
          The default value of this preprocessor, which is <span class="source">28 FPS</span>, should suffice for the
          majority of our classification needs.
      </md-card-content>

      <md-card-actions md-alignment="left">
        <md-field>
          <label>n</label>
          <md-input 
            @change="preprocessorSelectionUpdated"
            v-model="fpsThrottlerValue" type="number"></md-input>
          <span class="md-helper-text">Target FPS</span>
        </md-field>
      </md-card-actions>
      <div class="type">
          <span>GENERIC</span>
      </div>
    </md-card>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import {
  PreProcessor,
  PreProcessorConfigMap,
  PreProcessorConfig
} from "processing/types";
import { DropNFramesPreProcessorId } from "@/processing/generic/dropnframes";
import * as device from "@/state/modules/device";

import * as preprocessors from "@/state/modules/preprocessors";

@Component({
  components: {}
})
export default class PreProcessing extends Vue {
  public mounted() {
    if (preprocessors.getShowIntro(this.$store) === undefined) {
      preprocessors.setShowIntro(this.$store, true);
    }
  }

  public preprocessorSelectionUpdated() {
    const preprocessorSelection: PreProcessorConfig[] = [];
    Object.keys(this.preprocessors).forEach(name => {
      if (this.preprocessors[name].enabled) {
        preprocessorSelection.push(this.preprocessors[name].constructConfig());
      }
    });
    this.deviceFacade.updatePreProcessors(preprocessorSelection);
  }

  public get deviceFacade() {
    return device.getDeviceFacade(this.$store);
  }

  public get preprocessors(): PreProcessorConfigMap {
    return preprocessors.getPreProcessors(this.$store);
  }

  public get showIntro(): boolean {
    return preprocessors.getShowIntro(this.$store) as boolean;
  }

  public set showIntro(change: boolean) {
    preprocessors.setShowIntro(this.$store, change);
  }

  public get naiveThrottlerSwitch() {
    return this.preprocessors.naiveThrottler.enabled;
  }

  public set naiveThrottlerSwitch(change: boolean) {
    preprocessors.modifyPreProcessor(this.$store, {
      name: "naiveThrottler",
      newState: { enabled: change }
    });
  }

  public get naiveThrottlerN() {
    return this.preprocessors.naiveThrottler.n;
  }

  public set naiveThrottlerN(change: number) {
    preprocessors.modifyPreProcessor(this.$store, {
      name: "naiveThrottler",
      newState: { n: change }
    });
  }

  public get uselessFrameSwitch() {
    return this.preprocessors.uselessFrames.enabled;
  }

  public set uselessFrameSwitch(change: boolean) {
    preprocessors.modifyPreProcessor(this.$store, {
      name: "uselessFrames",
      newState: { enabled: change }
    });
  }

  public get fpsThrottlerSwitch() {
    return this.preprocessors.fpsThrottler.enabled;
  }

  public set fpsThrottlerSwitch(change: boolean) {
    preprocessors.modifyPreProcessor(this.$store, {
      name: "fpsThrottler",
      newState: { enabled: change }
    });
  }

  public get fpsThrottlerValue() {
    return this.preprocessors.fpsThrottler.frameRate;
  }

  public set fpsThrottlerValue(change: number) {
    preprocessors.modifyPreProcessor(this.$store, {
      name: "fpsThrottler",
      newState: { frameRate: change }
    });
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  max-width: 700px;
  margin-top: 20px;
  transition: background-color 0.45s ease-in-out;
}

.md-card:hover {
  background-color: #efffef;
}

.md-card-header-text {
}
.type {
  display: flex;
  flex-direction: row-reverse;
  span {
    padding: 10px;
    font-weight: 200;
    user-select: none;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-in-out;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave {
  max-height: 300px;
}

.slide-leave-to,
.slide-enter {
  max-height: 0px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    color: white;
  }
  50% {
    color: #00897b;
  }
  100% {
    transform: rotate(360deg);
    color: white;
  }
}

.intro {
  background-color: #212121;
  color: white;
  padding: 20px;
  .header {
    .spin {
      animation: 3s ease-in-out 0s infinite spin;
    }
    .white-icon {
      color: white;
      margin-right: 5px;
    }
    span {
      align-self: center;
    }
    display: flex;
    justify-content: space-between;
  }
  .content {
    padding-left: 20px;
    padding-right: 20px;
    max-width: 500px;
  }
}

.cancelmargin {
  margin-top: -16px;
  margin-left: -16px;
  margin-right: -16px;
}
</style>
