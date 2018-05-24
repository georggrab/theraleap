import Vue from "vue";

import { ClassificationData } from "@/classify";
import { GenericHandTrackingData } from "@/devices";

export interface GameConfiguration {
  element: HTMLDivElement;
}

export interface Game {
  onStart: (
    config: GameConfiguration,
    notifyGameOver: () => void
  ) => Promise<void>;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onStop: (vm: Vue) => Promise<void>;

  onClassificationReceived: (c: ClassificationData) => void;
  onMotionTrackingDataReceived: (m: GenericHandTrackingData) => void;
}
