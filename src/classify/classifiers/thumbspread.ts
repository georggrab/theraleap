import { Observable, Operator, Subscriber } from "rxjs";
import { filter, map } from "rxjs/operators";

import { GenericHandTrackingData } from "@/devices/generic";
import { LeapHandTrackingData } from "@/devices/leapmotion";
import { ClassificationData } from "@/classify";

export const ThumbSpreadClassifierId = "ThumbSpreadClassifier-V0.1";

export class ThumbSpreadClassifier
  implements Operator<GenericHandTrackingData, ClassificationData> {
  constructor(private detectionThreshhold: number) {}

  public call(
    subscriber: Subscriber<ClassificationData>,
    source: Observable<GenericHandTrackingData>
  ) {
    return source
      .pipe(
        map(x => {
          return {
            actionName: "STUB",
            metrics: {
              quality: 0
            }
          };
        })
      )
      .subscribe(subscriber);
  }
}
