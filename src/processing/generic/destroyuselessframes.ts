import { Observable, Operator, Subscriber } from "rxjs";
import { filter } from "rxjs/operators";

import { GenericHandTrackingData } from "@/devices/generic";
import { LeapHandTrackingData } from "@/devices/leapmotion";

export const DestroyUselessFramesId = "DestroyUselessFrames-V0.1";

export class DestroyUselessFramesOperator
  implements Operator<GenericHandTrackingData, GenericHandTrackingData> {
  constructor() {}

  public call(
    subscriber: Subscriber<GenericHandTrackingData>,
    source: Observable<GenericHandTrackingData>
  ) {
    return source
      .pipe(
        filter((value: LeapHandTrackingData) => value.data.hands.length > 0)
      )
      .subscribe(subscriber);
  }
}
