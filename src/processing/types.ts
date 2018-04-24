import { Observable, Operator } from 'rxjs';
import { GenericHandTrackingData } from '@/devices';

export interface PreProcessor {
    process(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData>;
}

export interface PreProcessingEngine {
    getPreProcessors(): Operator<any, any>[];
    setPreProcessors(lp: Operator<any, any>[]): void;
    applyPreProcessors(inp: Observable<GenericHandTrackingData>): Observable<GenericHandTrackingData>;
}

export interface PreProcessorConfigMap {
    [preprocessorName: string]: PreProcessorDescription,
}

export interface PreProcessorDescription {
    enabled: boolean,
    constructConfig: () => PreProcessorConfig,
    [_ : string]: any,
}

export interface PreProcessorConfig {
    identifier: string;
    args: any[];
}