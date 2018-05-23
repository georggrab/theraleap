import { Game, GameConfiguration } from "@/games/types";
import { ClassificationData } from "@/classify";
import { GenericHandTrackingData } from "@/devices";

export default class SpaceShooterGame implements Game {
  async onStart(config: GameConfiguration) {
    console.log(config);
  }

  async onStop() {
    console.log("onStop");
  }

  async onPause() {
    console.log("onPause");
  }
  onClassificationReceived(c: ClassificationData) {}

  onMotionTrackingDataReceived(m: GenericHandTrackingData) {}
}
