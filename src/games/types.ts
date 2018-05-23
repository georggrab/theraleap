import { ClassificationData } from "classify";
import { GenericHandTrackingData } from "devices";

export interface Game {
  onStart: () => Promise<void>;
  onPause: () => Promise<void>;
  onStop: () => Promise<void>;

  onClassificationReceived: (c: ClassificationData) => void;
  onMotionTrackingDataReceived: (m: GenericHandTrackingData) => void;
}
