<template>
  <section>
    <md-card v-for="[key, value] in classifiers" :key="key">
      <md-card-media>
        <graphical-hand-logger :camera-position="[10, 10, 10]"
        :rotate="true" :source="examples[key]" v-if="examples[key] !== undefined" />
        <div v-else class="loading">
          <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
        </div>
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{value.metadata.name}}</div>
        <div class="md-subhead">{{value.metadata.shortDesc}}</div>
      </md-card-header>

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>

      <md-card-content>
        <md-subheader>Classifier Description</md-subheader>
        <section v-html="value.metadata.longDesc"></section>
        <md-subheader>Classifier Settings</md-subheader>
        <md-divider></md-divider>
        <section v-for="(s, index) in value.settings" :key="index">
          <md-field v-if="s.setting.type === SettingType.Slider">
            <label>{{ s.name }}</label>
            <md-input type="range" :min="s.setting.min" :max="s.setting.max" :step="s.setting.step" />
            <span class="md-helper-text">{{ s.desc }}</span>
          </md-field>
          <md-field v-else-if="s.setting.type === SettingType.String">
            <label>{{ s.name }}</label>
            <md-input type="text" />
            <span class="md-helper-text">{{ s.desc }}</span>
          </md-field>
          <md-field v-else-if="s.setting.type === SettingType.Number">
            <label>{{ s.name }}</label>
            <md-input type="number" />
            <span class="md-helper-text">{{ s.desc }}</span>
          </md-field>
        </section>
      </md-card-content>
    </md-card>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Observable } from 'rxjs';
import { Inject, Component } from "vue-property-decorator";
import { Classifier, ClassifierRegistry, SettingType } from "@/classify";

import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';
import { HandTrackRecording, record } from "@/state/modules/record";
import { createFakeDeviceStream, GenericHandTrackingData } from "@/devices";

@Component({
  components: {
    GraphicalHandLogger
  }
})
export default class Classifiers extends Vue {
  public SettingType = SettingType;

  public examples: {[key: string]: Observable<GenericHandTrackingData>} = {};

  public async created() {
    await this.classifiers.forEach(async([key, classifier]) => {
      const path = classifier.metadata.examplePath;
       if (path) {
          const response = await fetch(path);
          const recording = (await response.json()) as HandTrackRecording;
          Vue.set(this.examples, key, createFakeDeviceStream(recording));
       }
    });
  }

  get classifiers() {
    return Object.entries(ClassifierRegistry);
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