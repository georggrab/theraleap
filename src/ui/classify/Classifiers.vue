<template>
  <section>
    <md-card>
      <md-card-media>
        <graphical-hand-logger :camera-position="[10, 10, 10]"
        :rotate="true" :source="examples.ThumbSpreadClassifier.stream" v-if="examples.ThumbSpreadClassifier.stream !== undefined" />
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
              @change="classifierSelectionUpdated('ThumbSpreadClassifier')"
              class="md-accent">Enable</md-switch>
        </div>
      </md-card-header>

      <md-card-content>
        <md-subheader>Classifier Description</md-subheader>
        <section>
          <h1>General</h1>
          Example Classifier initially provided with Theraleap. It does a naive classification of whether the User is spreading the Thumb. This classifier is intentionally very crude, as not much time was invested in its conception (development of classifiers is no integral part of the Theraleap student research project). Instead, this classifier is supposed to give a proof of concept of how classifiers are integrated and configured in Theraleap.
          <h1>Algorithm</h1>
          This classifier detects the extension of the thumb. It does so naively simply by looking at the thumb position in a configurable timeframe (<span class="source">window</span>). It first computes the difference between the maximum and minimum thumb positions in the timeframe. If (and only if) a significant decisive factor is determined (as configured by <span class="source">detectionThreshhold</span>), the first derivative of the historic thumb positions is taken, and the first zero intersection is searched. Zero intersections of the first derivatives denote a change of direction. If a zero intersection is found in the first derivative, it is fuzzily (as configurable through <span class="source">symmetryTolerance</span>) determined if the intersection is centered in the dataset. Finally, the detection may be throttled (<span class="source">detectionThrottle</span>) in order to prevent duplicate detections.
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
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Observable } from "rxjs";
import { Inject, Component } from "vue-property-decorator";
import { Classifier, ClassifierRegistry } from "@/classify";

import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import { HandTrackRecording } from "@/state/modules/record";
import { createFakeDeviceStream, GenericHandTrackingData } from "@/devices";

import {
  getClassifiers,
  modifyClassifier,
  disableAllClassifiers,
  getActiveClassifier
} from "@/state/modules/classifiers";
import { getDeviceFacade } from "@/state/modules/device";

@Component({
  components: {
    GraphicalHandLogger
  }
})
export default class Classifiers extends Vue {
  public examples: {
    [key: string]: {
      stream?: Observable<GenericHandTrackingData>;
      path: string;
    };
  } = {
    ThumbSpreadClassifier: {
      path: "/json/thera-rec-slow-thumb-spread.json"
    }
  };

  public async created() {
    await Object.entries(this.examples).forEach(async ([key, data]) => {
      const response = await fetch(data.path);
      const recording = (await response.json()) as HandTrackRecording;
      Vue.set(this.examples, key, {
        ...this.examples.key,
        stream: createFakeDeviceStream(recording)
      });
    });
  }

  public classifierSelectionUpdated(activeClassifier: string) {
    const currentClassifierState = this.classifierConfigState[activeClassifier]
      .enabled;
    disableAllClassifiers(this.$store);
    modifyClassifier(this.$store, {
      name: activeClassifier,
      newState: { enabled: !currentClassifierState }
    });
    this.facade.updateClassifier(getActiveClassifier(this.$store));
  }

  get facade() {
    return getDeviceFacade(this.$store);
  }

  get classifiers() {
    return Object.entries(ClassifierRegistry);
  }

  get classifierConfigState() {
    return getClassifiers(this.$store);
  }

  get thumbThreshhold() {
    return this.classifierConfigState.ThumbSpreadClassifier.threshhold;
  }
  set thumbThreshhold(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { threshhold: parseInt(newValue) }
    });
  }

  get thumbWindowSize() {
    return this.classifierConfigState.ThumbSpreadClassifier.windowSize;
  }
  set thumbWindowSize(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { windowSize: parseInt(newValue) }
    });
  }

  get thumbWindowInterval() {
    return this.classifierConfigState.ThumbSpreadClassifier.windowInterval;
  }
  set thumbWindowInterval(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { windowInterval: parseInt(newValue) }
    });
  }

  get thumbSymmetryTolerance() {
    return this.classifierConfigState.ThumbSpreadClassifier.symmetryTolerance;
  }
  set thumbSymmetryTolerance(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { symmetryTolerance: parseInt(newValue) }
    });
  }

  get thumbThrottleTime() {
    return this.classifierConfigState.ThumbSpreadClassifier.throttleTime;
  }
  set thumbThrottleTime(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { throttleTime: parseInt(newValue) }
    });
  }

  get leapPointableIdentifier() {
    return this.classifierConfigState.ThumbSpreadClassifier
      .leapPointableIdentifier;
  }
  set leapPointableIdentifier(newValue: string) {
    modifyClassifier(this.$store, {
      name: "ThumbSpreadClassifier",
      newState: { leapPointableIdentifier: parseInt(newValue) }
    });
  }

  get thumbSpreadClassifierEnabled() {
    return this.classifierConfigState.ThumbSpreadClassifier.enabled;
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
