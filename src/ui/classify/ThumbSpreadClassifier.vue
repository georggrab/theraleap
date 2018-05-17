<template>
    <md-card>
      <md-card-media>
        <graphical-hand-logger :camera-position="[10, 10, 10]"
        :rotate="true" :source="stream" v-if="stream !== undefined" />
        <div v-else class="loading">
          <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
        </div>
      </md-card-media>

      <md-card-header>
        <div class="md-title">Thumb Spread Classifier</div>
        <div class="md-subhead">Naive Spread detection soley based on virtualized Thumb position</div>
        <div class="enabled">
            <md-switch
              :value="!thumbSpreadClassifierEnabled"
              @change="classifierSelectionUpdated"
              class="md-accent">Enable</md-switch>
        </div>
      </md-card-header>

      <md-card-content>
        <md-subheader>Classifier Description</md-subheader>
        <section>
          <h1>General</h1>
          Example Classifier initially provided with Theraleap. It does a naive classification of whether the User is spreading the Thumb. This classifier is intentionally very crude, as not much time was invested in its conception (development of classifiers is no integral part of the Theraleap student research project). Instead, this classifier is supposed to give a proof of concept of how classifiers are integrated and configured in Theraleap.
          <h1>Algorithm</h1>
          This classifier detects the extension of the thumb. It does so naively simply by looking at the thumb position in a configurable timeframe (<s-code>window</s-code>). It first computes the difference between the maximum and minimum thumb positions in the timeframe. If (and only if) a significant decisive factor is determined (as configured by <s-code>detectionThreshhold</s-code>), the first derivative of the historic thumb positions is taken, and the first zero intersection is searched. Zero intersections of the first derivatives denote a change of direction. If a zero intersection is found in the first derivative, it is fuzzily (as configurable through <s-code>symmetryTolerance</s-code>) determined if the intersection is centered in the dataset. Finally, the detection may be throttled (<s-code>detectionThrottle</s-code>) in order to prevent duplicate detections.
          <h1>Performance Metric</h1>
          This classifier includes no Performance Metric. Metrics based on a configurable maximum Spread distance are thinkable as a possible next step.
          <h1>Cheat Metric</h1>
          This classifier includes no Cheat Metric.
          <h1>Room for Improvement</h1>
          This classifier should be replaced with something more robust in the future. The most fundamental flaw currently is that the classification is done based on thumb position alone, now something that makes more sense like thumb / index angle. Also, it only works for the left hand, but making the classifier independent of handedness is trivial.
        </section>
        <md-subheader>Classifier Settings</md-subheader>
        <md-divider></md-divider>
        <md-field>
          <label>Window size</label>
          <md-input v-model="thumbWindowSize" type="number" />
          <span class="md-helper-text">How large the detection window should be. The bigger this number, the slower the thumb has to be spread.</span>
        </md-field>
        <md-field>
          <label>Interval</label>
          <md-input v-model="thumbWindowInterval" type="number" />
          <span class="md-helper-text">How often to slice a window from historic thumb positions and run the detection. For example, a number of 50 for Interval, and 200 for Window size will run the classifier every 50 frames, always with the last 200 Frames.</span>
        </md-field>
        <md-field>
          <label>Detection Threshhold</label>
          <md-input v-model="thumbThreshhold" type="number" />
          <span class="md-helper-text">How generously to move forward with the detection. The bigger this number, the further the thumb has to be spread.</span>
        </md-field>
        <md-field>
          <label>Symmetry Tolerance</label>
          <md-input v-model="thumbSymmetryTolerance" type="number" />
          <span class="md-helper-text">How far centered the thumb direction change should be. The bigger this number, the further the direction change may be off center (and thus, more false positives are detected).</span>
        </md-field>
        <md-field>
          <label>Throttle time</label>
          <md-input v-model="thumbThrottleTime" type="number" />
          <span class="md-helper-text">Timeframe which should be considered a single thumb spread. For example, if 4 actual classifications are made in this window, it will be only considered to be a single classification.</span>
        </md-field>
        <md-field>
          <label>Pointable Identifier</label>
          <md-input v-model="leapPointableIdentifier" type="number" />
          <span class="md-helper-text">You can also use this classifier for other extremities. 0 is Thumb, 1 is Index, and so on.</span>
        </md-field>
      </md-card-content>
    </md-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Observable } from "rxjs";
import { Inject, Component, Prop } from "vue-property-decorator";
import { Classifier, ClassifierRegistry } from "@/classify";

import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import Code from "@/ui/utils/Code.vue";
import { HandTrackRecording } from "@/state/modules/record";
import { createFakeDeviceStream, GenericHandTrackingData } from "@/devices";

import {
  getClassifiers,
  modifyClassifier,
  disableAllClassifiers,
  getActiveClassifier
} from "@/state/modules/classifiers";
import { getDeviceFacade } from "@/state/modules/device";

const EVT_CLASSIFIER_SEL_UPDATED = "classifierSelectionUpdated";

@Component({
  components: {
    GraphicalHandLogger,
    "s-code": Code
  }
})
export default class ThumbSpreadClassifier extends Vue {
  @Prop() public stream!: Observable<GenericHandTrackingData>;

  @Prop() public config!: any;

  public classifierSelectionUpdated() {
    this.$emit(EVT_CLASSIFIER_SEL_UPDATED, "ThumbSpreadClassifier");
  }

  get thumbThreshhold() {
    return this.config.threshhold;
  }
  set thumbThreshhold(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { threshhold: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get thumbWindowSize() {
    return this.config.windowSize;
  }
  set thumbWindowSize(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { windowSize: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get thumbWindowInterval() {
    return this.config.windowInterval;
  }
  set thumbWindowInterval(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { windowInterval: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get thumbSymmetryTolerance() {
    return this.config.symmetryTolerance;
  }
  set thumbSymmetryTolerance(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { symmetryTolerance: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get thumbThrottleTime() {
    return this.config.throttleTime;
  }
  set thumbThrottleTime(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { throttleTime: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get leapPointableIdentifier() {
    return this.config.leapPointableIdentifier;
  }
  set leapPointableIdentifier(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { leapPointableIdentifier: parseInt(newValue) }
    });
    this.classifierSelectionUpdated();
  }

  get thumbSpreadClassifierEnabled() {
    return this.config.enabled;
  }
}
</script>
<style lang="scss">
.md-card {
  max-width: 800px;
}
.md-card-media {
  height: 400px;
}
.md-field {
  margin-bottom: 60px;
}

.loading {
  background: black;
  height: 400px;
  display: flex;
  .md-progress-spinner {
    margin: auto;
  }
}
</style>
