<template>
    <section id="GameOver">
        <section class="game-over-message">
            <h1>You Lose!</h1>
            <h2>Better Luck next time!</h2>
            <span>
                <play-button :name="'Retry'" @click="$router.push(`/games/play/${gameIdentifier}`)"></play-button>
            </span>
        </section>
        <md-divider />
        <section v-if="score !== undefined" class="highscore">
            Your final Score: <s-code>{{ score.toString().padStart(5, '0') }}</s-code> points.
        </section>
        <section v-if="statistics !== undefined">
            len of statistics: {{ statistics.length }}
        </section>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

import * as d3 from "d3";

import { GenericHandTrackingData } from "@/devices";
import PlayButton from "@/ui/games/PlayButton.vue";
import Code from "@/ui/utils/Code.vue";

@Component({
  components: {
    PlayButton,
    "s-code": Code
  }
})
export default class GameOver extends Vue {
  @Prop({ type: String, required: true })
  public gameIdentifier!: string;

  @Prop({ type: Number, required: false })
  public score: number | undefined;

  @Prop({ type: Array, required: false })
  public statistics: GenericHandTrackingData[] | undefined;
}
</script>
<style lang="scss" scoped>
.game-over-message {
  text-align: center;
  h1 {
    font-size: 2em;
    margin: 15px 0 0 0;
  }
  h2 {
    font-size: 1em;
  }
}
.md-divider {
  margin-top: 25px;
}
.highscore {
  margin: 25px;
  font-size: larger;
}
</style>
