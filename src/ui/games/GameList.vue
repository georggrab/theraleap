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
        <play-button @click="play('space-shooter')" />
        <play-button-motion-tracking @click="play('space-shooter')" />
      </md-card-actions>
    </md-card>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

import PlayButton from "@/ui/games/PlayButton.vue";
import PlayButtonMotionTracking from "@/ui/games/PlayButtonMotionTracking.vue";

@Component({
  components: {
    PlayButton,
    PlayButtonMotionTracking
  }
})
export default class GameList extends Vue {
  public play(id: string) {
    this.$router.push(`/games/play/${id}`);
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  max-width: 500px;
}
</style>
