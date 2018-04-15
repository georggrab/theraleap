<template>
  <section>
    <md-card v-for="[key, value] in classifiers" :key="key">
      <md-card-media>
        <graphical-hand-logger v-if="value.metadata.examplePath" />
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{value.metadata.name}}</div>
        <div class="md-subhead">{{key}}</div>
      </md-card-header>

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>

      <md-card-content>
        <md-subheader>Classifier Description</md-subheader>
        <section v-html="value.metadata.desc"></section>
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
import { Inject, Component } from "vue-property-decorator";
import { Classifier, ClassifierRegistry, SettingType } from "@/classify";

import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';
import { HandTrackRecording } from "state/modules/record";

@Component({
  components: {
    GraphicalHandLogger
  }
})
export default class Classifiers extends Vue {
  public SettingType = SettingType;

  private examples: {[key: string]: any} = {};

  public async created() {
    await Object.entries(ClassifierRegistry).forEach(async([key, classifier]) => {
      const path = classifier.metadata.examplePath;
       if (path) {
         this.examples[key] = await new Promise((r) => require([path], r.bind(this)));
       }
    });
  }

  public async getExampleSource(key: number) {
    const path = ClassifierRegistry[key].metadata.examplePath
    if (path) {
      const data = await new Promise((resolve) => require([path], resolve.bind(this)));
      console.log(data);
    }
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
.md-field input[type="range"] {
  margin-top: 25px;
}
</style>