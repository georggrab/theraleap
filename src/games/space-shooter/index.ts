import { Game } from "@/games/types";
import { ClassificationData } from "classify";
import { GenericHandTrackingData } from "devices";

export default class SpaceShooterGame implements Game {
  async onStart() {}

  async onStop() {}

  async onPause() {}
  onClassificationReceived(c: ClassificationData) {}

  onMotionTrackingDataReceived(m: GenericHandTrackingData) {}
}
