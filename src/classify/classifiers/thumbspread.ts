import { Observable, Operator, Subscriber } from "rxjs";
import {
  filter,
  map,
  bufferTime,
  debounceTime,
  throttleTime
} from "rxjs/operators";

import { GenericHandTrackingData } from "@/devices/generic";
import { LeapHandTrackingData, LeapPointable } from "@/devices/leapmotion";
import { ClassificationData } from "@/classify";
import { LeapDeviceFrame } from "@/devices/leapmotion/leaptrackingdata";

export const ThumbSpreadClassifierId = "ThumbSpreadClassifier-V0.1";

const diff = (vector: number[]): number[] => {
  const ret = [];
  for (var i = 0; i < vector.length - 1; i++) {
    ret.push(vector[i + 1] - vector[i]);
  }
  return ret;
};

const fZero = (vector: number[]): number | undefined => {
  var previous = vector[0];
  for (var i = 1; i < vector.length; i++) {
    if (previous < 0 && vector[i] >= 0) {
      return i;
    } else if (previous >= 0 && vector[i] < 0) {
      return i;
    }
    previous = vector[i];
  }
  return undefined;
};

export class ThumbSpreadClassifier
  implements Operator<LeapHandTrackingData, ClassificationData> {
  constructor(
    private windowSize: number,
    private windowInterval: number,
    private detectionThreshhold: number,
    private symmetryTolerance: number,
    private throttleTime: number,
    private leapPointableIdentifier: number
  ) {}

  public call(
    subscriber: Subscriber<ClassificationData>,
    source: Observable<LeapHandTrackingData>
  ) {
    return source
      .pipe(
        bufferTime(this.windowSize, this.windowInterval),
        map((bufferedData: LeapHandTrackingData[]) => {
          const thumbData: LeapPointable[] = [];
          bufferedData.forEach((data: LeapHandTrackingData) => {
            data.data.pointables.forEach(pointable => {
              if (pointable.type === this.leapPointableIdentifier) {
                thumbData.push(pointable);
              }
            });
          });
          return thumbData;
        }),
        map((thumbData: LeapPointable[]) => {
          const data = thumbData.map(d => d.tipPosition[0]);
          if (
            Math.max(...data) - Math.min(...data) <
            this.detectionThreshhold
          ) {
            return;
          }
          const nDeriv = diff(data);
          const zero = fZero(nDeriv);
          const leftOfZero = nDeriv.slice(0, zero);
          const rightOfZero = nDeriv.slice(zero);
          if (
            leftOfZero.length > 10 &&
            rightOfZero.length > 10 &&
            Math.abs(leftOfZero.length - rightOfZero.length) <
              this.symmetryTolerance
          ) {
            return {
              actionName: "STUB",
              metrics: {
                quality: 0
              }
            };
          } else {
            return undefined;
          }
        }),
        filter(x => x !== undefined),
        throttleTime(this.throttleTime)
      )
      .subscribe(subscriber);
  }
}
