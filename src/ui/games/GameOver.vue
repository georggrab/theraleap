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
          Your Thumb Positions throughout the Game: (GUC Students, your turn!)
          <svg ref="svg" width="500" height="430">
            <g style="transform: translate(30, 0); stroke: black;">
              <path class="line" :d="line" />
            </g>
          </svg>
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
import { LeapHandTrackingData, LeapPointable } from "devices/leapmotion";

const getPointableWithId = (
  p: LeapPointable[],
  type: number
): LeapPointable | undefined => {
  let target = undefined;
  p.forEach(pointable => {
    if (pointable.type === type) {
      target = pointable;
      return;
    }
  });
  return target;
};

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

  public line: string | null = null;

  public mounted() {
    if (this.statistics) {
      const p: { data: number; index: number }[] = [];
      this.statistics.forEach((d: LeapHandTrackingData, idx) => {
        const pointable = getPointableWithId(d.data.pointables, 0);
        if (pointable !== undefined) {
          p.push({
            data: pointable.tipPosition[0],
            index: idx
          });
        }
      });
      const x = d3.scaleLinear().range([0, 500]);
      const y = d3.scaleLinear().range([300, 0]);
      const thumbPosLine = d3
        .line<{ data: number; index: number }>()
        .x(d => x(d.index))
        .y(d => y(d.data));

      x.domain([0, p.length]);
      y.domain([-200, 200]);
      this.line = thumbPosLine(p);

      const svg = d3.select(this.$refs.svg as d3.BaseType);

      svg
        .append("g")
        .attr("transform", "translate(30, 0)")
        // @ts-ignore
        .call(d3.axisLeft(y));

      svg
        .append("g")
        .attr("transform", "translate(30, 220)")
        // @ts-ignore
        .call(d3.axisBottom(x));
    }
  }
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
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
</style>
