<template>
    <section id="GameExecutor">
      <game-load-error :reason="gameLoadError" v-if="gameLoadError !== ''"></game-load-error>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

import GameLoadError from "@/ui/games/GameLoadError.vue";
import { GameResolveMapping } from "@/games/resolver";
import { Game } from "@/games/types";

@Component({
  components: {
    GameLoadError
  }
})
export default class GameExecutor extends Vue {
  @Prop({ type: String, required: true })
  public gameIdentifier!: string;

  public gameLoadError: string = "";

  public mounted() {
    const resolver: any = GameResolveMapping[this.gameIdentifier];
    if (resolver !== undefined) {
      resolver()
        .then((game: Game) => {})
        .catch((err: any) => {
          this.gameLoadError = `Found the Game ${
            this.gameIdentifier
          }, but couldn't load it. This is an internal Error.`;
        });
    } else {
      this.gameLoadError = `Couldn't find the Game ${
        this.gameIdentifier
      }. four - oh - four.`;
    }
  }
}
</script>
