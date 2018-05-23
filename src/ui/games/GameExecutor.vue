<template>
    <section id="GameExecutor">
      <transition name="fade">
        <game-load-error :reason="gameLoadError" v-if="gameLoadError !== ''"></game-load-error>
      </transition>
      <transition name="fade">
        <game-loading-spinner :gameName="gameIdentifier" v-if="gameIsLoading"></game-loading-spinner>
      </transition>
      <div id="gameTargetElement" :class="{visible: !gameIsLoading && gameLoadError === ''}" ref="gameElement"></div>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";
import { Subscription } from "rxjs";

import * as device from "@/state/modules/device";

import GameLoadError from "@/ui/games/GameLoadError.vue";
import GameLoadingSpinner from "@/ui/games/GameLoadingSpinner.vue";
import { GameResolveMapping } from "@/games/resolver";
import { Game, GameConfiguration } from "@/games/types";

@Component({
  components: {
    GameLoadError,
    GameLoadingSpinner
  },
  beforeRouteLeave: GameExecutor.prototype.beforeRouteLeave
})
export default class GameExecutor extends Vue {
  @Prop({ type: String, required: true })
  public gameIdentifier!: string;

  public gameLoadError: string = "";
  public gameIsLoading: boolean = true;

  private game: Game | undefined;

  private classificationSubscription: Subscription | undefined;
  private motionTrackingSubscription: Subscription | undefined;

  public async mounted() {
    this.cleanGameElement();
    const resolver: (() => Promise<any>) | undefined =
      GameResolveMapping[this.gameIdentifier];
    if (resolver !== undefined) {
      try {
        this.gameIsLoading = true;
        this.game = new (await resolver())();
        await this.game!.onStart({
          element: this.$refs.gameElement
        } as GameConfiguration);
        this.gameIsLoading = false;
      } catch (err) {
        this.gameIsLoading = false;
        this.gameLoadError = `Found the Game ${
          this.gameIdentifier
        }, but couldn't load it. This is an internal Error. ${err}`;
      }
    } else {
      this.gameLoadError = `Couldn't find the Game ${
        this.gameIdentifier
      }. four - oh - four.`;
    }
    this.setupStreams();
  }

  public async beforeRouteLeave(to: any, from: any, next: any) {
    if (this.game) {
      await this.game.onStop();
      next();
    }
  }

  public async beforeDestroy() {
    if (this.game) {
      await this.game.onStop();
    }
  }

  private cleanGameElement() {
    const el = this.$refs.gameElement as HTMLDivElement;
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  private setupStreams() {
    if (this.trackingData) {
      this.motionTrackingSubscription = this.trackingData.subscribe(data => {
        if (this.game) {
          this.game.onMotionTrackingDataReceived(data);
        }
      });
    }
    if (this.classificationData) {
      this.classificationSubscription = this.classificationData.subscribe(
        data => {
          if (this.game) {
            this.game.onClassificationReceived(data);
          }
        }
      );
    }
  }

  private get trackingData() {
    return device.getDeviceFacade(this.$store).getHandTrackingData(this.$store);
  }

  private get classificationData() {
    return device.getDeviceFacade(this.$store).getClassificationStream();
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
  opacity: 0;
  transition: opacity 0.5s ease;
}

#gameTargetElement.visible {
  opacity: 1;
}
</style>
