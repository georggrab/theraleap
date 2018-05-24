<template>
    <section id="PlayButtonMotionTracking">
        <md-button 
          :disabled="!classifierConfigured || !hasSalvagableStream"
          @click="$emit('click')"
          class="md-raised md-primary"><md-icon>play_arrow</md-icon><md-icon>settings_remote</md-icon>Play with Motion Tracking
          </md-button>
          <md-tooltip v-if="!classifierConfigured || !hasSalvagableStream" md-direction="right">
              <span v-if="!classifierConfigured">You or your therapist did not yet configure an appropriate gesture classifier for you. Please configure one in the Classification Tab.</span>
              <span v-if="!hasSalvagableStream">The Hand Tracking device doesn't seem to be plugged in. Please plug in the device first!</span></md-tooltip>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

import { hasSalvagableStream } from "@/state/utils";
import * as classifier from "@/state/modules/classifiers";

@Component({
  components: {}
})
export default class PlayButtonMotionTracking extends Vue {
  public get classifierConfigured() {
    return classifier.getActiveClassifier(this.$store) !== undefined;
  }

  public get hasSalvagableStream() {
    return hasSalvagableStream(this.$store);
  }
}
</script>
