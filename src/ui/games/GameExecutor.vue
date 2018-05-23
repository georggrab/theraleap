<template>
    <section id="GameExecutor">
      <transition name="fade">
        <game-load-error :reason="gameLoadError" v-if="gameLoadError !== ''"></game-load-error>
      </transition>
      <transition name="fade">
        <game-loading-spinner :gameName="gameIdentifier" v-if="gameIsLoading"></game-loading-spinner>
      </transition>
      <div id="gameTargetElement" v-if="!gameIsLoading && gameLoadError === ''" ref="gameElement"></div>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

import GameLoadError from "@/ui/games/GameLoadError.vue";
import GameLoadingSpinner from "@/ui/games/GameLoadingSpinner.vue";
import { GameResolveMapping } from "@/games/resolver";
import { Game } from "@/games/types";

@Component({
  components: {
    GameLoadError,
    GameLoadingSpinner
  }
})
export default class GameExecutor extends Vue {
  @Prop({ type: String, required: true })
  public gameIdentifier!: string;

  public gameLoadError: string = "";
  public gameIsLoading: boolean = true;

  public mounted() {
    const resolver: (() => Promise<any>) | undefined =
      GameResolveMapping[this.gameIdentifier];
    if (resolver !== undefined) {
      this.gameIsLoading = true;
      resolver()
        .then((game: Game) => {
          this.gameIsLoading = false;
        })
        .catch((err: any) => {
          this.gameIsLoading = false;
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
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#gameTargetElement {
  width: 100%;
  height: calc(100vh - 150px);
}
</style>
