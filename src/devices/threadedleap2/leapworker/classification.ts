import { ClassifierConfig, ClassifyResolver } from "@/classify";
import { ClassificationData } from "@/classify/classifier";
import { GenericHandTrackingData } from "@/devices";
import { LeapWorkerContext } from "@/devices/threadedleap2/leapworker/types";
import { Observable, Subject } from "rxjs";
import { WORKER_EVT_CLASSIFICATION } from "../messages";

export const updateClassifier = (
  conf: ClassifierConfig | undefined,
  ctx: LeapWorkerContext
) => {
  if (ctx.pipeline.classifySubscription) {
    ctx.pipeline.classifySubscription.unsubscribe();
  }
  if (ctx.pipeline.classifyOutputSubscription) {
    ctx.pipeline.classifyOutputSubscription.unsubscribe();
  }
  if (conf !== undefined) {
    ctx.pipeline.classifySubject = new Subject<GenericHandTrackingData>().pipe(
      (source: Observable<any>) => {
        return source.lift(ClassifyResolver(conf));
      }
    ) as Subject<GenericHandTrackingData>;
    ctx.pipeline.classifySubscription = ctx.pipeline.preprocessSubject.subscribe(
      ctx.pipeline.classifySubject
    );
    ctx.pipeline.classifyOutputSubscription = ctx.pipeline.classifySubject.subscribe(
      data => {
        ctx.postMessage({
          payload: data,
          type: WORKER_EVT_CLASSIFICATION
        });
      }
    );
    ctx.currentClassifierConfig = conf;
    console.debug("New Classifier", conf);
  }
};
