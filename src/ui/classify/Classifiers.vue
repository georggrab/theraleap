<template>
  <section>
    <thumb-spread-classifier
      :stream="examples.ThumbSpreadClassifier.stream" 
      :config="classifierConfigState.ThumbSpreadClassifier"
      @classifierSelectionUpdated="classifierSelectionUpdated"
    />
  </section>
</template>
<script lang="ts">
declare const __path__: string;

import Vue from "vue";
import { Observable } from "rxjs";
import { Inject, Component } from "vue-property-decorator";
import { Classifier, ClassifierRegistry } from "@/classify";

import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import ThumbSpreadClassifier from "@/ui/classify/ThumbSpreadClassifier.vue";
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
    ThumbSpreadClassifier
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
      path: `${__path__}json/thera-rec-slow-thumb-spread.json`
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
}
</script>
<style lang="scss" scoped>
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
