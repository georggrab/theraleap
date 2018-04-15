<template>
  <section>
    <md-card v-for="[key, value] in classifiers" :key="key">
      <md-card-media>
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
        <section v-html="value.metadata.desc"></section>
        <md-subheader>Settings</md-subheader>
        <md-divider></md-divider>
        <section v-for="(s, index) in value.settings" :key="index">
          <md-field v-if="s.setting.type === SettingType.Slider">
            <label>{{ s.name }}</label>
            <input type="range" :min="s.setting.min" :max="s.setting.max" :step="s.setting.step" />
          </md-field>
          <md-field v-else-if="s.setting.type === SettingType.String">
            <input type="text" />
          </md-field>
          <md-field v-else-if="s.setting.type === SettingType.Number">
            <input type="number" />
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

@Component({
  components: {}
})
export default class Classifiers extends Vue {
  public SettingType = SettingType;

  get classifiers() {
    return Object.entries(ClassifierRegistry);
  }
}
</script>