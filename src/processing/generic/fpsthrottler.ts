import { Observable, Operator, Subscriber } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { GenericHandTrackingData } from "@/devices";

export const FPSThrottlerId = "FPSThrottler-v0.01";

export class FPSThrottler
  implements Operator<GenericHandTrackingData, GenericHandTrackingData> {
  constructor(private targetFPS: number) {}

  public call(
    subscriber: Subscriber<GenericHandTrackingData>,
    source: Observable<GenericHandTrackingData>
  ) {
    return source
      .pipe(throttleTime(1000 / this.targetFPS))
      .subscribe(subscriber);
  }
}
