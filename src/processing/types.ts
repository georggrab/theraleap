import { GenericHandTrackingData } from "@/devices";
import { Observable, Operator } from "rxjs";

export interface PreProcessor {
  process(
    inp: Observable<GenericHandTrackingData>
  ): Observable<GenericHandTrackingData>;
}

export interface PreProcessingEngine {
  getPreProcessors(): Array<Operator<any, any>>;
  setPreProcessors(lp: Array<Operator<any, any>>): void;
  applyPreProcessors(
    inp: Observable<GenericHandTrackingData>
  ): Observable<GenericHandTrackingData>;
}

export interface PreProcessorConfigMap {
  [preprocessorName: string]: PreProcessorDescription;
}

export interface PreProcessorDescription {
  enabled: boolean;
  constructConfig: () => PreProcessorConfig;
  [_: string]: any;
}

export interface PreProcessorConfig {
  identifier: string;
  args: any[];
}
