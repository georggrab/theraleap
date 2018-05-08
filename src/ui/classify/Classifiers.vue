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
        <div class="md-subhead">Detects extension of the thumb</div>
      </md-card-header>

      <md-card-content>
        <md-subheader>Classifier Description</md-subheader>
        <section>This classifier detects the extension of the thumb.</section>
        <md-subheader>Classifier Settings</md-subheader>
        <md-divider></md-divider>
        <md-field>
          <label>Detection Threshhold</label>
          <md-input v-model="thumbThreshhold" type="number" />
          <span class="md-helper-text">How generously to trigger the detection (In Degrees between X and Y)</span>
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

import { getClassifiers, modifyClassifier } from "@/state/modules/classifiers";

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
}
</script>
<style lang="scss">
.md-card {
  max-width: 800px;
}
.md-card-media {
  height: 400px;
}
.md-field input[type="range"] {
  margin-top: 25px;
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
