<template>
    <section id="GameList">
    <md-card>
      <md-card-media>
      </md-card-media>

      <md-card-header>
        <div class="md-title">Space Shooter</div>
        <div class="md-subhead">Destroy evil Rocks with the epic power of your hand!</div>
      </md-card-header>

      <md-card-content>
        <md-subheader>Game Description</md-subheader>
        <section>
            Move the Spaceship by hovering the hand over the sensor. The therapist will show you the Gesture you need to do in order to shoot the spaceship.
        </section>
      </md-card-content>
      <md-card-actions>
        <md-button 
          @click="play('space-shooter')"
          class="md-raised md-primary"><md-icon>play_arrow</md-icon>Play
          </md-button>
        <md-button 
          :disabled="!classifierConfigured || !hasSalvagableStream"
          @click="play('space-shooter')"
          class="md-raised md-primary"><md-icon>play_arrow</md-icon><md-icon>settings_remote</md-icon>Play with Motion Tracking
          </md-button>
          <md-tooltip v-if="!classifierConfigured || !hasSalvagableStream" md-direction="right">
              <span v-if="!classifierConfigured">You or your therapist did not yet configure an appropriate gesture classifier for you. Please configure one in the Classification Tab.</span>
              <span v-if="!hasSalvagableStream">The Hand Tracking device doesn't seem to be plugged in. Please plug in the device first!</span></md-tooltip>
      </md-card-actions>
    </md-card>
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
export default class GameList extends Vue {
  public play(id: string) {
    this.$router.push(`/games/play/${id}`);
  }
  public get classifierConfigured() {
    return classifier.getActiveClassifier(this.$store) !== undefined;
  }

  public get hasSalvagableStream() {
    return hasSalvagableStream(this.$store);
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  max-width: 500px;
}
</style>
