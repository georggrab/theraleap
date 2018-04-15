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

      <md-card-content v-html="value.metadata.desc">
      </md-card-content>
    </md-card>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";
import { Classifier, ClassifierRegistry } from "@/classify";

@Component({
  components: {}
})
export default class Classifiers extends Vue {
  get classifiers() {
    return Object.entries(ClassifierRegistry);
  }
}
</script>