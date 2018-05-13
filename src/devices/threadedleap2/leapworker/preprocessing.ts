import { Observable, Subject } from "rxjs";

import { PreProcessorConfig } from "@/processing/types";
import { LeapWorkerContext } from "@/devices/threadedleap2/leapworker/types";
import { GenericHandTrackingData } from "@/devices";
import { PreProcessingResolver } from "@/processing/resolver";

export const initializePreProcessingPipeline = (ctx: LeapWorkerContext) => {
  ctx.pipeline.deviceFrameSubscription = ctx.pipeline.deviceFrameSubject.subscribe(
    ctx.pipeline.preprocessSubject
  );
  ctx.pipeline.preprocessSubscription = ctx.pipeline.preprocessSubject.subscribe(
    ctx.pipeline.outputSubject
  );
};

export const updatePreprocessors = (
  config: PreProcessorConfig[],
  ctx: LeapWorkerContext
) => {
  if (ctx.pipeline.preprocessSubscription) {
    ctx.pipeline.preprocessSubscription.unsubscribe();
  }
  if (ctx.pipeline.deviceFrameSubscription) {
    ctx.pipeline.deviceFrameSubscription.unsubscribe();
  }
  ctx.pipeline.preprocessSubject = new Subject<GenericHandTrackingData>().pipe(
    ...config.map(x => (source: Observable<GenericHandTrackingData>) =>
      source.lift(PreProcessingResolver(x))
    )
  ) as Subject<GenericHandTrackingData>;
  ctx.pipeline.preprocessSubscription = ctx.pipeline.preprocessSubject.subscribe(
    ctx.pipeline.outputSubject
  );
  ctx.pipeline.deviceFrameSubscription = ctx.pipeline.deviceFrameSubject.subscribe(
    ctx.pipeline.preprocessSubject
  );
};
