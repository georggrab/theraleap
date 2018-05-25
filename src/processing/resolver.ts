import { PreProcessor, PreProcessorConfig } from "@/processing/types";
import { Operator } from "rxjs";
import {
  DropNFramesOperator,
  DropNFramesPreProcessorId
} from "./generic/dropnframes";
import { FPSThrottler, FPSThrottlerId } from "./generic/fpsthrottler";
import {
  DestroyUselessFramesId,
  DestroyUselessFramesOperator
} from "./leap/destroyuselessframes";

/**
 * All Preprocessors ought to be registered here, so that device drivers or facades
 * (which might be running in Workers, so we can NOT pass Preprocessors to them directly)
 * know how to create an Object.
 * Basically, we pass the PreProcessors Constructor Arguments to the device driver, and
 * the device driver then proceeds to instantiate the concrete class.
 */
export const ResolverRegistry: {
  [_: string]: { new (...args: any[]): Operator<any, any> };
} = {
  [DropNFramesPreProcessorId]: DropNFramesOperator,
  [DestroyUselessFramesId]: DestroyUselessFramesOperator,
  [FPSThrottlerId]: FPSThrottler
};

export const PreProcessingResolver = (
  config: PreProcessorConfig
): Operator<any, any> => {
  return new ResolverRegistry[config.identifier](...config.args);
};
