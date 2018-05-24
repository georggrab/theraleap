<template>
    <section id="GameExecutor">
      <transition name="fade">
        <game-load-error :reason="gameLoadError" v-if="gameLoadError !== ''"></game-load-error>
      </transition>
      <transition name="fade">
        <game-loading-spinner :gameName="gameIdentifier" v-if="gameIsLoading"></game-loading-spinner>
      </transition>
      <transition @afterEnter="showControls = false" name="fadeout">
        <in-game-controls class="top-right-floating" v-if="showControls"></in-game-controls>
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
import InGameControls from "@/ui/games/InGameControls.vue";
import { GameResolveMapping } from "@/games/resolver";
import { Game, GameConfiguration } from "@/games/types";

@Component({
  components: {
    GameLoadError,
    GameLoadingSpinner,
    InGameControls
  },
  beforeRouteLeave: GameExecutor.prototype.beforeRouteLeave
})
export default class GameExecutor extends Vue {
  @Prop({ type: String, required: true })
  public gameIdentifier!: string;

  public showControls: boolean = false;

  public gameLoadError: string = "";
  public gameIsLoading: boolean = true;

  private game: Game | null = null;
  private gameIsPaused: boolean = false;

  private classificationSubscription: Subscription | undefined;
  private motionTrackingSubscription: Subscription | undefined;

  private keyUpEvent(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      if (this.game !== null && !this.gameIsPaused) {
        this.game.onPause();
      } else if (this.game !== null && this.gameIsPaused) {
        this.game.onResume();
      }
      this.gameIsPaused = !this.gameIsPaused;
    }
  }

  public async mounted() {
    this.cleanGameElement();
    await this.loadGame();
    this.initializePauseKeyListener();
    this.setupStreams();
  }

  public async beforeRouteLeave(to: any, from: any, next: any) {
    if (this.game) {
      await this.game.onPause();
      next();
    }
  }

  public async beforeDestroy() {
    if (this.game) {
      await this.game.onStop();
    }
    window.removeEventListener("keyup", this.keyUpEvent);
  }

  public pausePressed() {
    console.log("paused");
  }

  private async loadGame() {
    const resolver: (() => Promise<any>) | undefined =
      GameResolveMapping[this.gameIdentifier];
    if (resolver !== undefined) {
      try {
        this.gameIsLoading = true;
        this.game = new (await resolver())();
        await this.game!.onStart(
          {
            element: this.$refs.gameElement
          } as GameConfiguration,
          (arg: (vm: Vue) => void) => {
            arg(this);
          }
        );
        this.game!.onResume();
        this.gameIsLoading = false;
        this.showControls = true;
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
  }

  private initializePauseKeyListener() {
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      this.keyUpEvent(event);
    });
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
.top-right-floating {
  position: absolute;
  width: 450px;
  right: 25px;
  top: 150px;
}

.fadeout-enter {
  opacity: 0.7;
}
.fadeout-enter-active {
  transition: opacity 3s;
  transition-delay: 3s;
}
.fadeout-enter-to,
.fadeout-leave,
.fadeout-leave-active {
  opacity: 0;
}
</style>
