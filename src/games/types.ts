import { ClassificationData } from "@/classify";
import { GenericHandTrackingData } from "@/devices";

export interface GameConfiguration {
  element: HTMLDivElement;
}

export interface Game {
  onStart: (config: GameConfiguration) => Promise<void>;
  onPause: () => Promise<void>;
  onStop: () => Promise<void>;

  onClassificationReceived: (c: ClassificationData) => void;
  onMotionTrackingDataReceived: (m: GenericHandTrackingData) => void;
}
